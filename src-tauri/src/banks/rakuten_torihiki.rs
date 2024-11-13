use chrono::NaiveDate;
use serde::Deserialize;

use crate::{Bank, Transaction};

#[derive(Debug, Deserialize)]
struct CsvRow {
    #[serde(rename = "取引日")]
    date: String,
    #[serde(rename = "入出金(円)")]
    amount: String,
    #[serde(rename = "取引後残高(円)")]
    balance: String,
    #[serde(rename = "入出金内容")]
    summary: String,
}

impl From<CsvRow> for Transaction {
    fn from(value: CsvRow) -> Self {
        let external_id = format!("{} - {} - {}", &value.date, &value.summary, &value.balance);
        Transaction {
            summary: value.summary,
            bank: Bank::Rakuten,
            external_id,
            date: NaiveDate::parse_from_str(&value.date, "%Y%m%d").unwrap(),
            amount: value.amount.parse::<i64>().unwrap(),
        }
    }
}

pub fn parse_records(content: &[u8]) -> Vec<Transaction> {
    let (res, _, _) = encoding_rs::SHIFT_JIS.decode(content);
    let mut reader = csv::ReaderBuilder::new().from_reader(res.as_bytes());

    let mut res = Vec::new();
    for result in reader.deserialize::<CsvRow>() {
        let Ok(record) = result else { continue };
        res.push(record.into());
    }
    res
}

#[cfg(test)]
mod test {
    use crate::Bank;

    use super::*;

    const CONTENT: &str = r#"取引日,入出金(円),取引後残高(円),入出金内容
20220228,50,50,マスタ－カ－ドニュウカイデ５０エン
20220818,500000,500050,カズミン　イエヴヘン
20220902,-2214,497836,Mastercardデビット A0420985
"#;

    #[test]
    fn can_parse() {
        let (encoded, _, _) = encoding_rs::SHIFT_JIS.encode(CONTENT);
        let transactions = parse_records(&encoded);
        assert_eq!(transactions.len(), 3);

        // dates
        assert_eq!(
            transactions[0].date,
            NaiveDate::from_ymd_opt(2022, 2, 28).unwrap()
        );
        assert_eq!(
            transactions[1].date,
            NaiveDate::from_ymd_opt(2022, 8, 18).unwrap()
        );
        assert_eq!(
            transactions[2].date,
            NaiveDate::from_ymd_opt(2022, 9, 2).unwrap()
        );

        // bank
        assert_eq!(transactions[0].bank, Bank::Rakuten);
        assert_eq!(transactions[1].bank, Bank::Rakuten);
        assert_eq!(transactions[2].bank, Bank::Rakuten);

        // summary
        assert_eq!(transactions[0].summary, "マスタ－カ－ドニュウカイデ５０エン");
        assert_eq!(transactions[1].summary, "カズミン　イエヴヘン");
        assert_eq!(transactions[2].summary, "Mastercardデビット A0420985");

        // external_id
        assert_eq!(transactions[0].external_id, "20220228 - マスタ－カ－ドニュウカイデ５０エン - 50");
        assert_eq!(transactions[1].external_id, "20220818 - カズミン　イエヴヘン - 500050");
        assert_eq!(transactions[2].external_id, "20220902 - Mastercardデビット A0420985 - 497836");

        // amount
        assert_eq!(transactions[0].amount, 50);
        assert_eq!(transactions[1].amount, 500000);
        assert_eq!(transactions[2].amount, -2214);
    }
}
