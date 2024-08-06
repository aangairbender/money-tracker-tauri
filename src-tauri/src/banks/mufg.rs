use chrono::NaiveDate;
use serde::Deserialize;

use crate::Transaction;

#[derive(Debug, Deserialize)]
struct CsvRow {
    #[serde(rename = "日付")]
    date: String,
    #[serde(rename = "摘要")]
    _summary: String,
    #[serde(rename = "摘要内容")]
    description: String,
    #[serde(rename = "支払い金額")]
    expense_amount: String,
    #[serde(rename = "預かり金額")]
    income_amount: String,
    #[serde(rename = "差引残高")]
    _balance: String,
}

impl From<CsvRow> for Transaction {
    fn from(value: CsvRow) -> Self {
        let mut expense = value.expense_amount;
        expense.retain(|c| c != ',');
        let mut income = value.income_amount;
        income.retain(|c| c != ',');
        Transaction {
            external_id: format!("{} - {}", &value.date, &value.description),
            summary: value.description,
            bank: crate::Bank::Mufg,
            date: NaiveDate::parse_from_str(&value.date, "%Y/%-m/%-d").unwrap(),
            amount: income.parse().unwrap_or(0) - expense.parse().unwrap_or(0),
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

    const CONTENT: &str = r#""日付","摘要","摘要内容","支払い金額","預かり金額","差引残高"
"2023/6/2","デビット１","４９６４０６　ＵＢＥＲ　＊　Ｅ","3,960","","4,121,155"
"2023/6/2","デビット１","５２７３０７　ＴＥＰＣＯ","8,711","","4,112,444"
"2023/6/3","デビット１","８２４７５５　ＦＵＴＡＫＯＴＡ","","1,322","4,108,638"
"#;

    #[test]
    fn can_parse() {
        let (encoded, _, _) = encoding_rs::SHIFT_JIS.encode(CONTENT);
        let transactions = parse_records(&encoded);
        assert_eq!(transactions.len(), 3);
        
        // dates
        assert_eq!(transactions[0].date, NaiveDate::from_ymd_opt(2023, 6, 2).unwrap());
        assert_eq!(transactions[1].date, NaiveDate::from_ymd_opt(2023, 6, 2).unwrap());
        assert_eq!(transactions[2].date, NaiveDate::from_ymd_opt(2023, 6, 3).unwrap());

        // bank
        assert_eq!(transactions[0].bank, Bank::Mufg);
        assert_eq!(transactions[1].bank, Bank::Mufg);
        assert_eq!(transactions[2].bank, Bank::Mufg);

        // summary
        assert_eq!(transactions[0].summary, "４９６４０６　ＵＢＥＲ　＊　Ｅ");
        assert_eq!(transactions[1].summary, "５２７３０７　ＴＥＰＣＯ");
        assert_eq!(transactions[2].summary, "８２４７５５　ＦＵＴＡＫＯＴＡ");

        // external_id
        assert_eq!(transactions[0].external_id, "2023/6/2 - ４９６４０６　ＵＢＥＲ　＊　Ｅ");
        assert_eq!(transactions[1].external_id, "2023/6/2 - ５２７３０７　ＴＥＰＣＯ");
        assert_eq!(transactions[2].external_id, "2023/6/3 - ８２４７５５　ＦＵＴＡＫＯＴＡ");

        
        // amount
        assert_eq!(transactions[0].amount, -3960);
        assert_eq!(transactions[1].amount, -8711);
        assert_eq!(transactions[2].amount, 1322);
    }
}
