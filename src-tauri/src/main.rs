// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

use anyhow::bail;
use chrono::NaiveDate;
use csv::StringRecord;
use serde::Serialize;

mod banks;

#[derive(Serialize, PartialEq, Eq, Debug)]
#[serde(rename_all = "snake_case")]
enum Bank {
    Rakuten,
    Mufg,
    Smbc,
}

impl Bank {
    fn detect_from_headers(headers: &StringRecord) -> Option<Bank> {
        if &headers[2] == "摘要内容" { return Some(Bank::Mufg) }
        if &headers[2] == "ご利用金額（円）" { return Some(Bank::Rakuten) }
        if &headers[2] == "お預入れ" { return Some(Bank::Smbc) }

        None
    }
}

#[derive(Serialize)]
struct Transaction {
    summary: String,
    bank: Bank,
    external_id: String,
    date: NaiveDate,
    amount: i64,
}

#[derive(Serialize)]
struct LoadCsvResult {
    success: bool,
    transactions: Vec<Transaction>,
    error: String,
    bank: String,
}

fn load_csv_raw(path: &str) -> anyhow::Result<(Bank, Vec<Transaction>)> {
    let file = fs::read(path).unwrap();
    let (res, _, _) = encoding_rs::SHIFT_JIS.decode(&file);
    let file_bytes = res.as_bytes();
    let mut reader = csv::Reader::from_reader(file_bytes);

    let Some(bank) = ({
        let headers = reader.headers()?;
        Bank::detect_from_headers(headers)
    }) else {
        bail!("Cannot detect bank");
    };

    let res = match bank {
        Bank::Rakuten => banks::rakuten::parse_records(file_bytes),
        Bank::Mufg => banks::mufg::parse_records(file_bytes),
        Bank::Smbc => banks::smbc::parse_records(file_bytes),
    };

    Ok((bank, res))
}

#[tauri::command]
fn load_csv(path: String) -> LoadCsvResult {
    match load_csv_raw(&path) {
        anyhow::Result::Ok((bank, res)) => LoadCsvResult {
            success: true,
            transactions: res,
            error: "".into(),
            bank: serde_json::to_string(&bank).unwrap()
        },
        anyhow::Result::Err(e) => LoadCsvResult {
            success: false,
            transactions: Vec::new(),
            error: e.to_string(),
            bank: "".into(),
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_csv])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
