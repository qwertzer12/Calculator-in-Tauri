// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn calculate(a: f64, b: f64, operation: &str) -> Result<f64, String> {
    match operation {
        "+" => Ok(a + b),
        "-" => Ok(a - b),
        "*" => Ok(a * b),
        "/" => {
            if b == 0.0 {
                Err("Division by zero".to_string())
            } else {
                Ok(a / b)
            }
        },
        "%" => Ok(a % b),
        _ => Err(format!("Unknown operation: {}", operation))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![calculate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
