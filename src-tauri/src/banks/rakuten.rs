use chrono::NaiveDate;
use serde::Deserialize;

use crate::{Bank, Transaction};


#[derive(Debug, Deserialize)]
struct CsvRow {
    #[serde(rename = "ご利用日")]
    date: String,
    #[serde(rename = "ご利用先")]
    purpose: String,
    #[serde(rename = "ご利用金額（円）")]
    amount: String,
    #[serde(rename = "現地通貨額")]
    _local_currency_amount: String,
    #[serde(rename = "通貨略称")]
    _currency_abbreviation: String,
    #[serde(rename = "換算レート")]
    _exchange_rate: String,
    #[serde(rename = "使用地域")]
    _area_of_use: String,
    #[serde(rename = "照会番号")]
    reference_number: String,
    #[serde(rename = "承認番号")]
    _approval_number: String,
    #[serde(rename = "口座引落分（円）")]
    _account_deduction_amount: String,
    #[serde(rename = "ポイント利用分")]
    _points_used: String,
}

impl From<CsvRow> for Transaction {
    fn from(value: CsvRow) -> Self {
        Transaction {
            summary: value.purpose,
            bank: Bank::Rakuten,
            external_id: value.reference_number,
            date: NaiveDate::parse_from_str(&value.date, "%Y%m%d").unwrap(),
            amount: -value.amount.parse::<i64>().unwrap(),
        }
    }
}

pub fn parse_records(content: &[u8]) -> Vec<Transaction> {
    let (res, _, _) = encoding_rs::SHIFT_JIS.decode(content);
    let mut reader = csv::ReaderBuilder::new()
        .from_reader(res.as_bytes());

    let mut res = Vec::new();
    for result in reader.deserialize::<CsvRow>() {
        let record = result.unwrap();
        res.push(record.into());
    }
    res
}

#[cfg(test)]
mod test {
    use crate::Bank;

    use super::*;

    const CONTENT: &str = r#""ご利用日","ご利用先","ご利用金額（円）","現地通貨額","通貨略称","換算レート","使用地域","照会番号","承認番号","口座引落分（円）","ポイント利用分"
"20230105","成城石井　等々力店","3649","","","","国内","15578503005000641000763","575156","3649","0"
"20230109","成城石井　等々力店","1391","","","","国内","15578503009000807000769","897762","1391","0"
"20230109","ｽ-ﾊﾟ-ﾊﾞﾘﾕ- ﾄﾄﾞﾛｷﾃﾝ","5396","","","","国内","15208003010401280101304","930791","5396","0"
"#;

    #[test]
    fn can_parse() {
        let (encoded, _, _) = encoding_rs::SHIFT_JIS.encode(CONTENT);
        let transactions = parse_records(&encoded);
        assert_eq!(transactions.len(), 3);
        
        // dates
        assert_eq!(transactions[0].date, NaiveDate::from_ymd_opt(2023, 1, 5).unwrap());
        assert_eq!(transactions[1].date, NaiveDate::from_ymd_opt(2023, 1, 9).unwrap());
        assert_eq!(transactions[2].date, NaiveDate::from_ymd_opt(2023, 1, 9).unwrap());

        // bank
        assert_eq!(transactions[0].bank, Bank::Rakuten);
        assert_eq!(transactions[1].bank, Bank::Rakuten);
        assert_eq!(transactions[2].bank, Bank::Rakuten);

        // summary
        assert_eq!(transactions[0].summary, "成城石井　等々力店");
        assert_eq!(transactions[1].summary, "成城石井　等々力店");
        assert_eq!(transactions[2].summary, "ｽ-ﾊﾟ-ﾊﾞﾘﾕ- ﾄﾄﾞﾛｷﾃﾝ");

        // external_id
        assert_eq!(transactions[0].external_id, "15578503005000641000763");
        assert_eq!(transactions[1].external_id, "15578503009000807000769");
        assert_eq!(transactions[2].external_id, "15208003010401280101304");

        
        // amount
        assert_eq!(transactions[0].amount, -3649);
        assert_eq!(transactions[1].amount, -1391);
        assert_eq!(transactions[2].amount, -5396);
    }
}
