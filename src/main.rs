extern crate lambda_runtime as lambda;
extern crate serde_derive;
extern crate rusoto_dynamodb;
extern crate rusoto;
extern crate rusoto_core;

use serde_derive::{Deserialize, Serialize};

use lambda::{error::HandlerError};
use rusoto_dynamodb::{DynamoDb, DynamoDbClient, CreateBackupInput};
use rusoto_core::Region;

#[derive(Deserialize)]
struct Request {}
#[derive(Serialize)]
struct Response {}

fn backup(table_name: &str) {

    let client = DynamoDbClient::new(Region::UsEast1);

    let result = client.create_backup(CreateBackupInput {
        backup_name: String::from("lol"),
        table_name: String::from(table_name),
    } ).sync();

    match result {
        Ok(_) => {
            println!("Backup");
        }
        Err(err) => {
            panic!(err);
        }
    }

}

fn handler(_req: Request, _ctx: lambda::Context) -> Result<Response, HandlerError> {

    let tables = [
        "survey-dev-trash"
    ];

    for table_name in tables.iter() {

        backup(&table_name)

    }

    Ok(Response { })
}

fn main() -> Result<(), String>
{
    lambda::lambda!(handler);

    Ok(())

}