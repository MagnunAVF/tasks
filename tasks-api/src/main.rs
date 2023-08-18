#[macro_use]
extern crate rocket;

use rocket::response::status;
use rocket::serde::json::{json, Value};

#[get("/")]
fn health() -> Value {
    json!("OK")
}

#[get("/tasks")]
fn get_tasks() -> Value {
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
fn create_task() -> Value {
    json!({
        "id": 1,
        "title": "foo",
        "description": "bar kofkaojgfoaj jsdoijado aj",
        "done": false,
    })
}
#[put("/tasks/<id>", format = "json")]
fn update_task(id: i32) -> Value {
    json!({
        "id": id,
        "title": "foo",
        "description": "bar kofkaojgfoaj jsdoijado aj",
        "done": false,
    })
}
#[delete("/tasks/<_id>")]
fn delete_task(_id: i32) -> status::NoContent {
    status::NoContent
}

#[rocket::main]
async fn main() {
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
        .launch()
        .await;
}
