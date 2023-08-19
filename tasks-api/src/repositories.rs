use crate::models::{NewTask, Task};
use crate::schema::tasks;
use diesel::prelude::*;

pub struct TaskRepository;

impl TaskRepository {
    pub fn find(c: &mut SqliteConnection, id: i32) -> QueryResult<Task> {
        tasks::table.find(id).get_result::<Task>(c)
    }

    pub fn find_multiple(c: &mut SqliteConnection, limit: i64) -> QueryResult<Vec<Task>> {
        tasks::table
            .order(tasks::updated_at.desc())
            .limit(limit)
            .load::<Task>(c)
    }

    pub fn create(c: &mut SqliteConnection, new_task: NewTask) -> QueryResult<Task> {
        diesel::insert_into(tasks::table)
            .values(new_task)
            .execute(c)?;

        let last_id = Self::last_inserted_id(c)?;
        Self::find(c, last_id)
    }

    pub fn save(c: &mut SqliteConnection, id: i32, task: Task) -> QueryResult<Task> {
        let current_time = diesel::dsl::sql::<diesel::sql_types::Timestamp>("CURRENT_TIMESTAMP");

        diesel::update(tasks::table.find(id))
            .set((
                tasks::title.eq(task.title.to_owned()),
                tasks::description.eq(task.description.to_owned()),
                tasks::done.eq(task.done.to_owned()),
                tasks::updated_at.eq(current_time),
            ))
            .execute(c)?;

        Self::find(c, id)
    }

    pub fn delete(c: &mut SqliteConnection, id: i32) -> QueryResult<usize> {
        diesel::delete(tasks::table.find(id)).execute(c)
    }

    fn last_inserted_id(c: &mut SqliteConnection) -> QueryResult<i32> {
        tasks::table
            .select(tasks::id)
            .order(tasks::id.desc())
            .first(c)
    }
}
