use serde_json::Value;
use std::collections::HashMap;

use tokio;

#[tokio::main]
async fn main() -> reqwest::Result<()> {
    let client = reqwest::Client::new();
    let mut constraint1: HashMap<String, Value> = HashMap::new();
    let mut constraint2: HashMap<String, Value> = HashMap::new();
    let mut constraint3: HashMap<String, Value> = HashMap::new();
    constraint1.insert("constraint".into(), "all_edge".into());
    constraint1.insert("args".into(), vec!["node1", "node2"].into());
    constraint2.insert("constraint".into(), "all_edge".into());
    constraint2.insert("args".into(), vec!["node2", "node3"].into());
    constraint3.insert("constraint".into(), "all_edge".into());
    constraint3.insert("args".into(), vec!["node1", "node3"].into());
    let payload = vec![constraint1, constraint2, constraint3];
    let final_store = client
        .post("http://127.0.0.1:3000/impliedrelationscheck")
        .json(&payload)
        .send()
        .await?
        .text()
        .await?;
    println!("Final store: {}", final_store);
    Ok(())
}
