use crate::DbConn;
use rocket::{Build, Rocket};

pub async fn run_db_migrations(rocket: Rocket<Build>) -> Rocket<Build> {
    use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

    const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

    DbConn::get_one(&rocket)
        .await
        .expect("Unable to retrieve connection")
        .run(|c| {
            c.run_pending_migrations(MIGRATIONS)
                .expect("Migrations failed");
        })
        .await;

    rocket
}
