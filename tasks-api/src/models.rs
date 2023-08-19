use crate::schema::tasks;
use diesel::{AsChangeset, Insertable, Queryable};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Queryable, AsChangeset)]
pub struct Task {
    #[serde(skip_deserializing)]
    pub id: i32,
    pub title: String,
    pub description: String,
    pub done: bool,
    #[serde(skip_deserializing)]
    pub created_at: String,
    #[serde(skip_deserializing)]
    pub updated_at: String,
}

#[derive(Deserialize, Insertable)]
#[diesel(table_name = tasks)]
pub struct NewTask {
    pub title: String,
    pub description: String,
    pub done: bool,
}
