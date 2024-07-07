use chrono::DateTime;
use serde::Deserialize;

use crate::Transaction;

#[derive(Debug, Deserialize)]
pub struct CsvRow {
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
        Transaction {
            external_id: format!("{} - {}", &value.date, &value.description),
            summary: value.description,
            bank: crate::Bank::Mufg,
            date: DateTime::parse_from_str(&value.date, "%Y/%m/%d").unwrap().into(),
            amount: value.income_amount.parse().unwrap_or(0) - value.expense_amount.parse().unwrap_or(0),
        }
    }
}

pub fn parse_records(reader: &mut csv::Reader<&[u8]>) -> Vec<Transaction> {
    let mut res = Vec::new();
    for result in reader.deserialize::<CsvRow>() {
        let Ok(record) = result else { continue };
        res.push(record.into());
    }
    res
}
