use wasm_bindgen::prelude::*;
use meval::eval_str;

#[wasm_bindgen]
pub fn add(a: f64, b: f64) -> f64 {
    a + b
}

#[wasm_bindgen]
pub fn subtract(a: f64, b: f64) -> f64 {
    a - b
}

#[wasm_bindgen]
pub fn multiply(a: f64, b: f64) -> f64 {
    a * b
}

#[wasm_bindgen]
pub fn divide(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        panic!("Cannot divide by zero");
    }
    a / b
}

#[wasm_bindgen]
pub fn calculate(expression: &str) -> Result<f64, String> {
    match eval_str(expression) {
        Ok(result) => Ok(result),
        Err(e) => Err(format!("Error: {}", e)), 
    }
}

