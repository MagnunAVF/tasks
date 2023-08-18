// @generated automatically by Diesel CLI.

diesel::table! {
    tasks (id) {
        id -> Integer,
        title -> Text,
        description -> Text,
        done -> Bool,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}
