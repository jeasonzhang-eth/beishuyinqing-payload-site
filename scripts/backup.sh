#!/bin/sh
set -eu

data_dir=${PAYLOAD_DATA_DIR:-./data}
media_dir=${PAYLOAD_MEDIA_DIR:-./media}
backup_root=${PAYLOAD_BACKUP_DIR:-./backups}
database_path=${PAYLOAD_DATABASE_PATH:-$data_dir/payload.db}
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
final_dir=$backup_root/$timestamp

if [ ! -f "$database_path" ]; then
  echo "Payload database not found: $database_path" >&2
  exit 1
fi

mkdir -p "$backup_root"
temporary_dir=$(mktemp -d "$backup_root/.payload-backup.XXXXXX")
trap 'rm -rf "$temporary_dir"' EXIT HUP INT TERM

sqlite3 "$database_path" ".backup '$temporary_dir/payload.db'"

if [ -d "$media_dir" ]; then
  tar -C "$media_dir" -czf "$temporary_dir/media.tar.gz" .
else
  mkdir "$temporary_dir/empty-media"
  tar -C "$temporary_dir/empty-media" -czf "$temporary_dir/media.tar.gz" .
  rmdir "$temporary_dir/empty-media"
fi

(
  cd "$temporary_dir"
  sha256sum payload.db media.tar.gz > SHA256SUMS
)

mv "$temporary_dir" "$final_dir"
trap - EXIT HUP INT TERM
echo "$final_dir"
