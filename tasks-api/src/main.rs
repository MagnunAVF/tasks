#[macro_use]
extern crate rocket;

extern crate dotenv;

mod auth;
mod migrations;
mod models;
mod repositories;
mod schema;

use auth::BasicAuth;
use diesel::result::Error::NotFound;
use dotenv::dotenv;
use migrations::run_db_migrations;
use models::{NewTask, Task};
use repositories::TaskRepository;
use rocket::fairing::AdHoc;
use rocket::http::Status;
use rocket::response::status;
use rocket::response::status::Custom;
use rocket::serde::json::{json, Json, Value};
use rocket_sync_db_pools::database;

#[database("sqlite")]
struct DbConn(diesel::SqliteConnection);

#[catch(404)]
fn not_found() -> Value {
    json!("Not found!")
}

#[get("/")]
fn health() -> Value {
    json!("OK")
}

#[get("/tasks")]
async fn get_tasks(db: DbConn) -> Result<Value, Custom<Value>> {
    db.run(|c| {
        TaskRepository::find_multiple(c, 100)
            .map(|tasks| json!(tasks))
            .map_err(|e| Custom(Status::InternalServerError, json!(e.to_string())))
    })
    .await
}

#[get("/tasks/<id>")]
async fn get_task(id: i32, db: DbConn) -> Result<Value, Custom<Value>> {
    db.run(move |c| {
        TaskRepository::find(c, id)
            .map(|task| json!(task))
            .map_err(|e| match e {
                NotFound => Custom(Status::NotFound, json!(e.to_string())),
                _ => Custom(Status::InternalServerError, json!(e.to_string())),
            })
    })
    .await
}

#[post("/tasks", format = "json", data = "<new_task>")]
async fn create_task(
    _auth: BasicAuth,
    db: DbConn,
    new_task: Json<NewTask>,
) -> Result<Value, Custom<Value>> {
    db.run(|c| {
        TaskRepository::create(c, new_task.into_inner())
            .map(|rustacean| json!(rustacean))
            .map_err(|e| Custom(Status::InternalServerError, json!(e.to_string())))
    })
    .await
}

#[put("/tasks/<id>", format = "json", data = "<task>")]
async fn update_task(
    id: i32,
    _auth: BasicAuth,
    db: DbConn,
    task: Json<Task>,
) -> Result<Value, Custom<Value>> {
    db.run(move |c| {
        TaskRepository::save(c, id, task.into_inner())
            .map(|rustacean| json!(rustacean))
            .map_err(|e| Custom(Status::InternalServerError, json!(e.to_string())))
    })
    .await
}

#[delete("/tasks/<id>")]
async fn delete_task(
    id: i32,
    _auth: BasicAuth,
    db: DbConn,
) -> Result<status::NoContent, Custom<Value>> {
    db.run(move |c| {
        TaskRepository::delete(c, id)
            .map(|_| status::NoContent)
            .map_err(|e| Custom(Status::InternalServerError, json!(e.to_string())))
    })
    .await
}

#[rocket::main]
async fn main() {
    dotenv().ok();

    let _ = rocket::build()
        .mount(
            "/",
            routes![
                health,
                get_tasks,
                get_task,
                create_task,
                update_task,
                delete_task
            ],
        )
        .register("/", catchers![not_found])
        .attach(DbConn::fairing())
        .attach(AdHoc::on_ignite("Diesel migrations", run_db_migrations))
        .launch()
        .await;
}
