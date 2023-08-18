#[macro_use]
extern crate rocket;

extern crate dotenv;

mod auth;

use auth::BasicAuth;

use dotenv::dotenv;
use rocket::response::status;
use rocket::serde::json::{json, Value};
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
fn get_tasks(_db: DbConn) -> Value {
    json!([
        {
            "id": 1,
            "title": "foo",
            "description": "bar kofkaojgfoaj jsdoijado aj",
            "done": false,
        },
        {
            "id": 2,
            "title": "foo 2",
            "description": "bar 2",
            "done": true,
        },
    ])
}
#[get("/tasks/<id>")]
fn view_task(id: i32) -> Value {
    json!({
        "id": id,
        "title": "foo",
        "description": "bar kofkaojgfoaj jsdoijado aj",
        "done": false,
    })
}
#[post("/tasks", format = "json")]
fn create_task(_auth: BasicAuth) -> Value {
    json!({
        "id": 1,
        "title": "foo",
        "description": "bar kofkaojgfoaj jsdoijado aj",
        "done": false,
    })
}
#[put("/tasks/<id>", format = "json")]
fn update_task(id: i32, _auth: BasicAuth) -> Value {
    json!({
        "id": id,
        "title": "foo",
        "description": "bar kofkaojgfoaj jsdoijado aj",
        "done": false,
    })
}
#[delete("/tasks/<_id>")]
fn delete_task(_id: i32, _auth: BasicAuth) -> status::NoContent {
    status::NoContent
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
                view_task,
                create_task,
                update_task,
                delete_task
            ],
        )
        .register("/", catchers![not_found])
        .attach(DbConn::fairing())
        .launch()
        .await;
}
