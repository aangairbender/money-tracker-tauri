use chrono::NaiveDate;
use serde::Deserialize;

use crate::{Bank, Transaction};

#[derive(Debug, Deserialize)]
struct CsvRow {
    #[serde(rename = "年月日")]
    date: String,
    #[serde(rename = "お引出し")]
    withdrawal: String,
    #[serde(rename = "お預入れ")]
    deposit: String,
    #[serde(rename = "お取り扱い内容")]
    content: String,
    #[serde(rename = "残高")]
    balance: String,
    #[serde(rename = "メモ")]
    _memo: String,
    #[serde(rename = "ラベル")]
    _label: String,
}

impl From<CsvRow> for Transaction {
    fn from(value: CsvRow) -> Self {
        let external_id = format!("{} - {} - {}", &value.date, &value.content, &value.balance);
        Transaction {
            summary: value.content,
            bank: Bank::Smbc,
            external_id,
            date: NaiveDate::parse_from_str(&value.date, "%Y/%-m/%-d").unwrap(),
            amount: value.deposit.parse().unwrap_or(0) - value.withdrawal.parse().unwrap_or(0),
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

    const CONTENT: &str = r#"年月日,お引出し,お預入れ,お取り扱い内容,残高,メモ,ラベル
2024/7/6,,18,"Vｻｶﾞｸ617812",9293,"",
2024/7/4,8196,,"V617812",9275,"",
2024/6/29,13,,"Vｻｶﾞｸ105376",17471,"",
"#;

    #[test]
    fn can_parse() {
        let (encoded, _, _) = encoding_rs::SHIFT_JIS.encode(CONTENT);
        let transactions = parse_records(&encoded);
        assert_eq!(transactions.len(), 3);

        // dates
        assert_eq!(
            transactions[0].date,
            NaiveDate::from_ymd_opt(2024, 7, 6).unwrap()
        );
        assert_eq!(
            transactions[1].date,
            NaiveDate::from_ymd_opt(2024, 7, 4).unwrap()
        );
        assert_eq!(
            transactions[2].date,
            NaiveDate::from_ymd_opt(2024, 6, 29).unwrap()
        );

        // bank
        assert_eq!(transactions[0].bank, Bank::Smbc);
        assert_eq!(transactions[1].bank, Bank::Smbc);
        assert_eq!(transactions[2].bank, Bank::Smbc);

        // summary
        assert_eq!(transactions[0].summary, "Vｻｶﾞｸ617812");
        assert_eq!(transactions[1].summary, "V617812");
        assert_eq!(transactions[2].summary, "Vｻｶﾞｸ105376");

        // external_id
        assert_eq!(transactions[0].external_id, "2024/7/6 - Vｻｶﾞｸ617812 - 9293");
        assert_eq!(transactions[1].external_id, "2024/7/4 - V617812 - 9275");
        assert_eq!(
            transactions[2].external_id,
            "2024/6/29 - Vｻｶﾞｸ105376 - 17471"
        );

        // amount
        assert_eq!(transactions[0].amount, 18);
        assert_eq!(transactions[1].amount, -8196);
        assert_eq!(transactions[2].amount, -13);
    }
}
