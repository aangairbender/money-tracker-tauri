// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

use chrono::NaiveDate;
use serde::Serialize;

mod banks;

#[derive(Serialize, PartialEq, Eq, Debug)]
#[serde(rename_all = "snake_case")]
enum Bank {
    Rakuten,
    Mufg,
    Smbc,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
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
}

fn load_csv_raw(path: &str) -> anyhow::Result<Vec<Transaction>> {
    let bytes = fs::read(path).unwrap();

    let mut res = Vec::new();
    res.append(&mut banks::rakuten::parse_records(&bytes));
    res.append(&mut banks::rakuten_torihiki::parse_records(&bytes));
    res.append(&mut banks::mufg::parse_records(&bytes));
    res.append(&mut banks::smbc::parse_records(&bytes));

    Ok(res)
}

#[tauri::command]
fn load_csv(path: String) -> LoadCsvResult {
    match load_csv_raw(&path) {
        anyhow::Result::Ok(res) => LoadCsvResult {
            success: true,
            transactions: res,
            error: "".into(),
        },
        anyhow::Result::Err(e) => LoadCsvResult {
            success: false,
            transactions: Vec::new(),
            error: e.to_string(),
        },
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![load_csv])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
