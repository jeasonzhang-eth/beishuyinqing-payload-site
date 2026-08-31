import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`role\` text DEFAULT 'admin' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`projects_outcomes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_outcomes_order_idx\` ON \`projects_outcomes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_outcomes_parent_id_idx\` ON \`projects_outcomes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_workflow\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_workflow_order_idx\` ON \`projects_workflow\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_workflow_parent_id_idx\` ON \`projects_workflow\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_faq_order_idx\` ON \`projects_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_faq_parent_id_idx\` ON \`projects_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_seo_keywords_order_idx\` ON \`projects_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_seo_keywords_parent_id_idx\` ON \`projects_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`language\` text,
  	\`translation_key\` text,
  	\`slug\` text,
  	\`source_id\` text,
  	\`route_key\` text,
  	\`translation_identity\` text,
  	\`kind\` text,
  	\`summary\` text,
  	\`definition\` text,
  	\`audience\` text,
  	\`overview\` text,
  	\`why\` text,
  	\`next\` text,
  	\`featured\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_no_index\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_slug_idx\` ON \`projects\` (\`slug\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_source_id_idx\` ON \`projects\` (\`source_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_route_key_idx\` ON \`projects\` (\`route_key\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_translation_identity_idx\` ON \`projects\` (\`translation_identity\`);`)
  await db.run(sql`CREATE INDEX \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`projects__status_idx\` ON \`projects\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_outcomes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_outcomes_order_idx\` ON \`_projects_v_version_outcomes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_outcomes_parent_id_idx\` ON \`_projects_v_version_outcomes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_workflow\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_workflow_order_idx\` ON \`_projects_v_version_workflow\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_workflow_parent_id_idx\` ON \`_projects_v_version_workflow\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_faq_order_idx\` ON \`_projects_v_version_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_faq_parent_id_idx\` ON \`_projects_v_version_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_seo_keywords_order_idx\` ON \`_projects_v_version_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_seo_keywords_parent_id_idx\` ON \`_projects_v_version_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_language\` text,
  	\`version_translation_key\` text,
  	\`version_slug\` text,
  	\`version_source_id\` text,
  	\`version_route_key\` text,
  	\`version_translation_identity\` text,
  	\`version_kind\` text,
  	\`version_summary\` text,
  	\`version_definition\` text,
  	\`version_audience\` text,
  	\`version_overview\` text,
  	\`version_why\` text,
  	\`version_next\` text,
  	\`version_featured\` integer DEFAULT false,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_no_index\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_parent_idx\` ON \`_projects_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_slug_idx\` ON \`_projects_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_source_id_idx\` ON \`_projects_v\` (\`version_source_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_route_key_idx\` ON \`_projects_v\` (\`version_route_key\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_translation_identity_idx\` ON \`_projects_v\` (\`version_translation_identity\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_updated_at_idx\` ON \`_projects_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_created_at_idx\` ON \`_projects_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version__status_idx\` ON \`_projects_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_created_at_idx\` ON \`_projects_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_updated_at_idx\` ON \`_projects_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_latest_idx\` ON \`_projects_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_autosave_idx\` ON \`_projects_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`services_deliverables\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_deliverables_order_idx\` ON \`services_deliverables\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_deliverables_parent_id_idx\` ON \`services_deliverables\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_process_order_idx\` ON \`services_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_process_parent_id_idx\` ON \`services_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_seo_keywords_order_idx\` ON \`services_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_seo_keywords_parent_id_idx\` ON \`services_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`language\` text,
  	\`translation_key\` text,
  	\`slug\` text,
  	\`source_id\` text,
  	\`route_key\` text,
  	\`translation_identity\` text,
  	\`summary\` text,
  	\`best_for\` text,
  	\`evidence\` text,
  	\`boundaries\` text,
  	\`enabled\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_no_index\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_source_id_idx\` ON \`services\` (\`source_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_route_key_idx\` ON \`services\` (\`route_key\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_translation_identity_idx\` ON \`services\` (\`translation_identity\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`services__status_idx\` ON \`services\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_services_v_version_deliverables\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_v_version_deliverables_order_idx\` ON \`_services_v_version_deliverables\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_deliverables_parent_id_idx\` ON \`_services_v_version_deliverables\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_services_v_version_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_v_version_process_order_idx\` ON \`_services_v_version_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_process_parent_id_idx\` ON \`_services_v_version_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_services_v_version_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_v_version_seo_keywords_order_idx\` ON \`_services_v_version_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_seo_keywords_parent_id_idx\` ON \`_services_v_version_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_services_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_language\` text,
  	\`version_translation_key\` text,
  	\`version_slug\` text,
  	\`version_source_id\` text,
  	\`version_route_key\` text,
  	\`version_translation_identity\` text,
  	\`version_summary\` text,
  	\`version_best_for\` text,
  	\`version_evidence\` text,
  	\`version_boundaries\` text,
  	\`version_enabled\` integer DEFAULT true,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_no_index\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_v_parent_idx\` ON \`_services_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_slug_idx\` ON \`_services_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_source_id_idx\` ON \`_services_v\` (\`version_source_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_route_key_idx\` ON \`_services_v\` (\`version_route_key\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_translation_identity_idx\` ON \`_services_v\` (\`version_translation_identity\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_updated_at_idx\` ON \`_services_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_created_at_idx\` ON \`_services_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version__status_idx\` ON \`_services_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_created_at_idx\` ON \`_services_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_updated_at_idx\` ON \`_services_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_latest_idx\` ON \`_services_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_autosave_idx\` ON \`_services_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`notes_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`notes_tags_order_idx\` ON \`notes_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`notes_tags_parent_id_idx\` ON \`notes_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`notes_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`notes_faq_order_idx\` ON \`notes_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`notes_faq_parent_id_idx\` ON \`notes_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`notes_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`notes_seo_keywords_order_idx\` ON \`notes_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`notes_seo_keywords_parent_id_idx\` ON \`notes_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`notes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`language\` text,
  	\`translation_key\` text,
  	\`slug\` text,
  	\`source_id\` text,
  	\`route_key\` text,
  	\`translation_identity\` text,
  	\`summary\` text,
  	\`content\` text,
  	\`published_at\` text,
  	\`source_updated_at\` text,
  	\`featured\` integer DEFAULT false,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_no_index\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`notes_slug_idx\` ON \`notes\` (\`slug\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`notes_source_id_idx\` ON \`notes\` (\`source_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`notes_route_key_idx\` ON \`notes\` (\`route_key\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`notes_translation_identity_idx\` ON \`notes\` (\`translation_identity\`);`)
  await db.run(sql`CREATE INDEX \`notes_updated_at_idx\` ON \`notes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`notes_created_at_idx\` ON \`notes\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`notes__status_idx\` ON \`notes\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_notes_v_version_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_notes_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_notes_v_version_tags_order_idx\` ON \`_notes_v_version_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_version_tags_parent_id_idx\` ON \`_notes_v_version_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_notes_v_version_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_notes_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_notes_v_version_faq_order_idx\` ON \`_notes_v_version_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_version_faq_parent_id_idx\` ON \`_notes_v_version_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_notes_v_version_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_notes_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_notes_v_version_seo_keywords_order_idx\` ON \`_notes_v_version_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_version_seo_keywords_parent_id_idx\` ON \`_notes_v_version_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_notes_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_language\` text,
  	\`version_translation_key\` text,
  	\`version_slug\` text,
  	\`version_source_id\` text,
  	\`version_route_key\` text,
  	\`version_translation_identity\` text,
  	\`version_summary\` text,
  	\`version_content\` text,
  	\`version_published_at\` text,
  	\`version_source_updated_at\` text,
  	\`version_featured\` integer DEFAULT false,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_no_index\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_notes_v_parent_idx\` ON \`_notes_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_version_version_slug_idx\` ON \`_notes_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_version_version_source_id_idx\` ON \`_notes_v\` (\`version_source_id\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_version_version_route_key_idx\` ON \`_notes_v\` (\`version_route_key\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_version_version_translation_identity_idx\` ON \`_notes_v\` (\`version_translation_identity\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_version_version_updated_at_idx\` ON \`_notes_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_version_version_created_at_idx\` ON \`_notes_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_version_version__status_idx\` ON \`_notes_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_created_at_idx\` ON \`_notes_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_updated_at_idx\` ON \`_notes_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_latest_idx\` ON \`_notes_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_notes_v_autosave_idx\` ON \`_notes_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`projects_id\` integer,
  	\`services_id\` integer,
  	\`notes_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`notes_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_notes_id_idx\` ON \`payload_locked_documents_rels\` (\`notes_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text,
  	\`site_url\` text,
  	\`author_name\` text,
  	\`github_url\` text,
  	\`llms_description\` text,
  	\`default_language\` text DEFAULT 'zh',
  	\`legal_name_zh\` text,
  	\`legal_name_en\` text,
  	\`short_name_zh\` text,
  	\`short_name_en\` text,
  	\`phone_display\` text,
  	\`phone_href\` text,
  	\`address_zh\` text,
  	\`address_en\` text,
  	\`city_zh\` text,
  	\`city_en\` text,
  	\`postal_code\` text,
  	\`country_code\` text,
  	\`icp_number\` text,
  	\`icp_url\` text,
  	\`verification_file\` text,
  	\`default_seo_title\` text,
  	\`default_seo_description\` text,
  	\`default_share_image_id\` integer,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`default_share_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_default_share_image_idx\` ON \`site_settings\` (\`default_share_image_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings__status_idx\` ON \`site_settings\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_site_name\` text,
  	\`version_site_url\` text,
  	\`version_author_name\` text,
  	\`version_github_url\` text,
  	\`version_llms_description\` text,
  	\`version_default_language\` text DEFAULT 'zh',
  	\`version_legal_name_zh\` text,
  	\`version_legal_name_en\` text,
  	\`version_short_name_zh\` text,
  	\`version_short_name_en\` text,
  	\`version_phone_display\` text,
  	\`version_phone_href\` text,
  	\`version_address_zh\` text,
  	\`version_address_en\` text,
  	\`version_city_zh\` text,
  	\`version_city_en\` text,
  	\`version_postal_code\` text,
  	\`version_country_code\` text,
  	\`version_icp_number\` text,
  	\`version_icp_url\` text,
  	\`version_verification_file\` text,
  	\`version_default_seo_title\` text,
  	\`version_default_seo_description\` text,
  	\`version_default_share_image_id\` integer,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`version_default_share_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version_default_share_image_idx\` ON \`_site_settings_v\` (\`version_default_share_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version__status_idx\` ON \`_site_settings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_latest_idx\` ON \`_site_settings_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_autosave_idx\` ON \`_site_settings_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`site_copy\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`zh_language_name\` text,
  	\`zh_site_controls_label\` text,
  	\`zh_primary_navigation_label\` text,
  	\`zh_redirect_message\` text,
  	\`zh_redirect_link_label\` text,
  	\`zh_alternate_language\` text,
  	\`zh_theme_light\` text,
  	\`zh_theme_dark\` text,
  	\`zh_view_work\` text,
  	\`zh_read_notes\` text,
  	\`zh_contact_action\` text,
  	\`zh_selected_work\` text,
  	\`zh_current_notes\` text,
  	\`zh_workspace\` text,
  	\`zh_active_threads\` text,
  	\`zh_projects_title\` text,
  	\`zh_notes_title\` text,
  	\`zh_project_label\` text,
  	\`zh_note_label\` text,
  	\`zh_services_label\` text,
  	\`zh_company_label\` text,
  	\`zh_about_label\` text,
  	\`zh_contact_label\` text,
  	\`zh_definition\` text,
  	\`zh_best_for\` text,
  	\`zh_overview\` text,
  	\`zh_why_it_matters\` text,
  	\`zh_outcomes\` text,
  	\`zh_workflow\` text,
  	\`zh_principles\` text,
  	\`zh_checklist\` text,
  	\`zh_examples\` text,
  	\`zh_next_steps\` text,
  	\`zh_faq\` text,
  	\`zh_footer_company\` text,
  	\`zh_footer_contact\` text,
  	\`zh_footer_office\` text,
  	\`en_language_name\` text,
  	\`en_site_controls_label\` text,
  	\`en_primary_navigation_label\` text,
  	\`en_redirect_message\` text,
  	\`en_redirect_link_label\` text,
  	\`en_alternate_language\` text,
  	\`en_theme_light\` text,
  	\`en_theme_dark\` text,
  	\`en_view_work\` text,
  	\`en_read_notes\` text,
  	\`en_contact_action\` text,
  	\`en_selected_work\` text,
  	\`en_current_notes\` text,
  	\`en_workspace\` text,
  	\`en_active_threads\` text,
  	\`en_projects_title\` text,
  	\`en_notes_title\` text,
  	\`en_project_label\` text,
  	\`en_note_label\` text,
  	\`en_services_label\` text,
  	\`en_company_label\` text,
  	\`en_about_label\` text,
  	\`en_contact_label\` text,
  	\`en_definition\` text,
  	\`en_best_for\` text,
  	\`en_overview\` text,
  	\`en_why_it_matters\` text,
  	\`en_outcomes\` text,
  	\`en_workflow\` text,
  	\`en_principles\` text,
  	\`en_checklist\` text,
  	\`en_examples\` text,
  	\`en_next_steps\` text,
  	\`en_faq\` text,
  	\`en_footer_company\` text,
  	\`en_footer_contact\` text,
  	\`en_footer_office\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`site_copy__status_idx\` ON \`site_copy\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_site_copy_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_zh_language_name\` text,
  	\`version_zh_site_controls_label\` text,
  	\`version_zh_primary_navigation_label\` text,
  	\`version_zh_redirect_message\` text,
  	\`version_zh_redirect_link_label\` text,
  	\`version_zh_alternate_language\` text,
  	\`version_zh_theme_light\` text,
  	\`version_zh_theme_dark\` text,
  	\`version_zh_view_work\` text,
  	\`version_zh_read_notes\` text,
  	\`version_zh_contact_action\` text,
  	\`version_zh_selected_work\` text,
  	\`version_zh_current_notes\` text,
  	\`version_zh_workspace\` text,
  	\`version_zh_active_threads\` text,
  	\`version_zh_projects_title\` text,
  	\`version_zh_notes_title\` text,
  	\`version_zh_project_label\` text,
  	\`version_zh_note_label\` text,
  	\`version_zh_services_label\` text,
  	\`version_zh_company_label\` text,
  	\`version_zh_about_label\` text,
  	\`version_zh_contact_label\` text,
  	\`version_zh_definition\` text,
  	\`version_zh_best_for\` text,
  	\`version_zh_overview\` text,
  	\`version_zh_why_it_matters\` text,
  	\`version_zh_outcomes\` text,
  	\`version_zh_workflow\` text,
  	\`version_zh_principles\` text,
  	\`version_zh_checklist\` text,
  	\`version_zh_examples\` text,
  	\`version_zh_next_steps\` text,
  	\`version_zh_faq\` text,
  	\`version_zh_footer_company\` text,
  	\`version_zh_footer_contact\` text,
  	\`version_zh_footer_office\` text,
  	\`version_en_language_name\` text,
  	\`version_en_site_controls_label\` text,
  	\`version_en_primary_navigation_label\` text,
  	\`version_en_redirect_message\` text,
  	\`version_en_redirect_link_label\` text,
  	\`version_en_alternate_language\` text,
  	\`version_en_theme_light\` text,
  	\`version_en_theme_dark\` text,
  	\`version_en_view_work\` text,
  	\`version_en_read_notes\` text,
  	\`version_en_contact_action\` text,
  	\`version_en_selected_work\` text,
  	\`version_en_current_notes\` text,
  	\`version_en_workspace\` text,
  	\`version_en_active_threads\` text,
  	\`version_en_projects_title\` text,
  	\`version_en_notes_title\` text,
  	\`version_en_project_label\` text,
  	\`version_en_note_label\` text,
  	\`version_en_services_label\` text,
  	\`version_en_company_label\` text,
  	\`version_en_about_label\` text,
  	\`version_en_contact_label\` text,
  	\`version_en_definition\` text,
  	\`version_en_best_for\` text,
  	\`version_en_overview\` text,
  	\`version_en_why_it_matters\` text,
  	\`version_en_outcomes\` text,
  	\`version_en_workflow\` text,
  	\`version_en_principles\` text,
  	\`version_en_checklist\` text,
  	\`version_en_examples\` text,
  	\`version_en_next_steps\` text,
  	\`version_en_faq\` text,
  	\`version_en_footer_company\` text,
  	\`version_en_footer_contact\` text,
  	\`version_en_footer_office\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_copy_v_version_version__status_idx\` ON \`_site_copy_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_copy_v_created_at_idx\` ON \`_site_copy_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_copy_v_updated_at_idx\` ON \`_site_copy_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_copy_v_latest_idx\` ON \`_site_copy_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_site_copy_v_autosave_idx\` ON \`_site_copy_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`home_page_zh_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_zh_headline_lines_order_idx\` ON \`home_page_zh_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_zh_headline_lines_parent_id_idx\` ON \`home_page_zh_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_zh_seo_keywords_order_idx\` ON \`home_page_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_zh_seo_keywords_parent_id_idx\` ON \`home_page_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_zh_method_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_zh_method_steps_order_idx\` ON \`home_page_zh_method_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_zh_method_steps_parent_id_idx\` ON \`home_page_zh_method_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_en_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_en_headline_lines_order_idx\` ON \`home_page_en_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_en_headline_lines_parent_id_idx\` ON \`home_page_en_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_en_seo_keywords_order_idx\` ON \`home_page_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_en_seo_keywords_parent_id_idx\` ON \`home_page_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page_en_method_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_en_method_steps_order_idx\` ON \`home_page_en_method_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_en_method_steps_parent_id_idx\` ON \`home_page_en_method_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`zh_title\` text,
  	\`zh_description\` text,
  	\`zh_eyebrow\` text,
  	\`zh_headline\` text,
  	\`zh_lede\` text,
  	\`zh_seo_title\` text,
  	\`zh_seo_description\` text,
  	\`zh_seo_no_index\` integer DEFAULT false,
  	\`zh_identity\` text,
  	\`zh_primary_actions_label\` text,
  	\`zh_artwork_alt\` text,
  	\`zh_artwork_caption\` text,
  	\`zh_services_title\` text,
  	\`zh_services_intro\` text,
  	\`zh_method_eyebrow\` text,
  	\`zh_method_title\` text,
  	\`zh_company_eyebrow\` text,
  	\`zh_company_title\` text,
  	\`zh_company_text\` text,
  	\`en_title\` text,
  	\`en_description\` text,
  	\`en_eyebrow\` text,
  	\`en_headline\` text,
  	\`en_lede\` text,
  	\`en_seo_title\` text,
  	\`en_seo_description\` text,
  	\`en_seo_no_index\` integer DEFAULT false,
  	\`en_identity\` text,
  	\`en_primary_actions_label\` text,
  	\`en_artwork_alt\` text,
  	\`en_artwork_caption\` text,
  	\`en_services_title\` text,
  	\`en_services_intro\` text,
  	\`en_method_eyebrow\` text,
  	\`en_method_title\` text,
  	\`en_company_eyebrow\` text,
  	\`en_company_title\` text,
  	\`en_company_text\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page__status_idx\` ON \`home_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_zh_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_zh_headline_lines_order_idx\` ON \`_home_page_v_version_zh_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_zh_headline_lines_parent_id_idx\` ON \`_home_page_v_version_zh_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_zh_seo_keywords_order_idx\` ON \`_home_page_v_version_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_zh_seo_keywords_parent_id_idx\` ON \`_home_page_v_version_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_zh_method_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_zh_method_steps_order_idx\` ON \`_home_page_v_version_zh_method_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_zh_method_steps_parent_id_idx\` ON \`_home_page_v_version_zh_method_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_en_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_en_headline_lines_order_idx\` ON \`_home_page_v_version_en_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_en_headline_lines_parent_id_idx\` ON \`_home_page_v_version_en_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_en_seo_keywords_order_idx\` ON \`_home_page_v_version_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_en_seo_keywords_parent_id_idx\` ON \`_home_page_v_version_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_en_method_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_en_method_steps_order_idx\` ON \`_home_page_v_version_en_method_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_en_method_steps_parent_id_idx\` ON \`_home_page_v_version_en_method_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_zh_title\` text,
  	\`version_zh_description\` text,
  	\`version_zh_eyebrow\` text,
  	\`version_zh_headline\` text,
  	\`version_zh_lede\` text,
  	\`version_zh_seo_title\` text,
  	\`version_zh_seo_description\` text,
  	\`version_zh_seo_no_index\` integer DEFAULT false,
  	\`version_zh_identity\` text,
  	\`version_zh_primary_actions_label\` text,
  	\`version_zh_artwork_alt\` text,
  	\`version_zh_artwork_caption\` text,
  	\`version_zh_services_title\` text,
  	\`version_zh_services_intro\` text,
  	\`version_zh_method_eyebrow\` text,
  	\`version_zh_method_title\` text,
  	\`version_zh_company_eyebrow\` text,
  	\`version_zh_company_title\` text,
  	\`version_zh_company_text\` text,
  	\`version_en_title\` text,
  	\`version_en_description\` text,
  	\`version_en_eyebrow\` text,
  	\`version_en_headline\` text,
  	\`version_en_lede\` text,
  	\`version_en_seo_title\` text,
  	\`version_en_seo_description\` text,
  	\`version_en_seo_no_index\` integer DEFAULT false,
  	\`version_en_identity\` text,
  	\`version_en_primary_actions_label\` text,
  	\`version_en_artwork_alt\` text,
  	\`version_en_artwork_caption\` text,
  	\`version_en_services_title\` text,
  	\`version_en_services_intro\` text,
  	\`version_en_method_eyebrow\` text,
  	\`version_en_method_title\` text,
  	\`version_en_company_eyebrow\` text,
  	\`version_en_company_title\` text,
  	\`version_en_company_text\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_version__status_idx\` ON \`_home_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_created_at_idx\` ON \`_home_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_updated_at_idx\` ON \`_home_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_latest_idx\` ON \`_home_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_autosave_idx\` ON \`_home_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`about_page_zh_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_zh_headline_lines_order_idx\` ON \`about_page_zh_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_zh_headline_lines_parent_id_idx\` ON \`about_page_zh_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_zh_seo_keywords_order_idx\` ON \`about_page_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_zh_seo_keywords_parent_id_idx\` ON \`about_page_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_zh_experience\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_zh_experience_order_idx\` ON \`about_page_zh_experience\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_zh_experience_parent_id_idx\` ON \`about_page_zh_experience\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_zh_focus\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_zh_focus_order_idx\` ON \`about_page_zh_focus\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_zh_focus_parent_id_idx\` ON \`about_page_zh_focus\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_zh_work\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_zh_work_order_idx\` ON \`about_page_zh_work\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_zh_work_parent_id_idx\` ON \`about_page_zh_work\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_en_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_en_headline_lines_order_idx\` ON \`about_page_en_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_en_headline_lines_parent_id_idx\` ON \`about_page_en_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_en_seo_keywords_order_idx\` ON \`about_page_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_en_seo_keywords_parent_id_idx\` ON \`about_page_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_en_experience\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_en_experience_order_idx\` ON \`about_page_en_experience\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_en_experience_parent_id_idx\` ON \`about_page_en_experience\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_en_focus\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_en_focus_order_idx\` ON \`about_page_en_focus\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_en_focus_parent_id_idx\` ON \`about_page_en_focus\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_en_work\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_en_work_order_idx\` ON \`about_page_en_work\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_en_work_parent_id_idx\` ON \`about_page_en_work\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`zh_title\` text,
  	\`zh_description\` text,
  	\`zh_eyebrow\` text,
  	\`zh_headline\` text,
  	\`zh_lede\` text,
  	\`zh_seo_title\` text,
  	\`zh_seo_description\` text,
  	\`zh_seo_no_index\` integer DEFAULT false,
  	\`zh_experience_title\` text,
  	\`zh_focus_title\` text,
  	\`zh_work_title\` text,
  	\`zh_contact_title\` text,
  	\`zh_contact\` text,
  	\`en_title\` text,
  	\`en_description\` text,
  	\`en_eyebrow\` text,
  	\`en_headline\` text,
  	\`en_lede\` text,
  	\`en_seo_title\` text,
  	\`en_seo_description\` text,
  	\`en_seo_no_index\` integer DEFAULT false,
  	\`en_experience_title\` text,
  	\`en_focus_title\` text,
  	\`en_work_title\` text,
  	\`en_contact_title\` text,
  	\`en_contact\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page__status_idx\` ON \`about_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_zh_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_zh_headline_lines_order_idx\` ON \`_about_page_v_version_zh_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_zh_headline_lines_parent_id_idx\` ON \`_about_page_v_version_zh_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_zh_seo_keywords_order_idx\` ON \`_about_page_v_version_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_zh_seo_keywords_parent_id_idx\` ON \`_about_page_v_version_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_zh_experience\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_zh_experience_order_idx\` ON \`_about_page_v_version_zh_experience\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_zh_experience_parent_id_idx\` ON \`_about_page_v_version_zh_experience\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_zh_focus\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_zh_focus_order_idx\` ON \`_about_page_v_version_zh_focus\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_zh_focus_parent_id_idx\` ON \`_about_page_v_version_zh_focus\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_zh_work\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_zh_work_order_idx\` ON \`_about_page_v_version_zh_work\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_zh_work_parent_id_idx\` ON \`_about_page_v_version_zh_work\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_en_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_en_headline_lines_order_idx\` ON \`_about_page_v_version_en_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_en_headline_lines_parent_id_idx\` ON \`_about_page_v_version_en_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_en_seo_keywords_order_idx\` ON \`_about_page_v_version_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_en_seo_keywords_parent_id_idx\` ON \`_about_page_v_version_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_en_experience\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_en_experience_order_idx\` ON \`_about_page_v_version_en_experience\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_en_experience_parent_id_idx\` ON \`_about_page_v_version_en_experience\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_en_focus\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_en_focus_order_idx\` ON \`_about_page_v_version_en_focus\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_en_focus_parent_id_idx\` ON \`_about_page_v_version_en_focus\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_en_work\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_en_work_order_idx\` ON \`_about_page_v_version_en_work\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_en_work_parent_id_idx\` ON \`_about_page_v_version_en_work\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_zh_title\` text,
  	\`version_zh_description\` text,
  	\`version_zh_eyebrow\` text,
  	\`version_zh_headline\` text,
  	\`version_zh_lede\` text,
  	\`version_zh_seo_title\` text,
  	\`version_zh_seo_description\` text,
  	\`version_zh_seo_no_index\` integer DEFAULT false,
  	\`version_zh_experience_title\` text,
  	\`version_zh_focus_title\` text,
  	\`version_zh_work_title\` text,
  	\`version_zh_contact_title\` text,
  	\`version_zh_contact\` text,
  	\`version_en_title\` text,
  	\`version_en_description\` text,
  	\`version_en_eyebrow\` text,
  	\`version_en_headline\` text,
  	\`version_en_lede\` text,
  	\`version_en_seo_title\` text,
  	\`version_en_seo_description\` text,
  	\`version_en_seo_no_index\` integer DEFAULT false,
  	\`version_en_experience_title\` text,
  	\`version_en_focus_title\` text,
  	\`version_en_work_title\` text,
  	\`version_en_contact_title\` text,
  	\`version_en_contact\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_version__status_idx\` ON \`_about_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_created_at_idx\` ON \`_about_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_updated_at_idx\` ON \`_about_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_latest_idx\` ON \`_about_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_autosave_idx\` ON \`_about_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`company_page_zh_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_page_zh_headline_lines_order_idx\` ON \`company_page_zh_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_page_zh_headline_lines_parent_id_idx\` ON \`company_page_zh_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_page_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_page_zh_seo_keywords_order_idx\` ON \`company_page_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_page_zh_seo_keywords_parent_id_idx\` ON \`company_page_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_page_zh_fields\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_page_zh_fields_order_idx\` ON \`company_page_zh_fields\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_page_zh_fields_parent_id_idx\` ON \`company_page_zh_fields\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_page_zh_principles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_page_zh_principles_order_idx\` ON \`company_page_zh_principles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_page_zh_principles_parent_id_idx\` ON \`company_page_zh_principles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_page_en_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_page_en_headline_lines_order_idx\` ON \`company_page_en_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_page_en_headline_lines_parent_id_idx\` ON \`company_page_en_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_page_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_page_en_seo_keywords_order_idx\` ON \`company_page_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_page_en_seo_keywords_parent_id_idx\` ON \`company_page_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_page_en_fields\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_page_en_fields_order_idx\` ON \`company_page_en_fields\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_page_en_fields_parent_id_idx\` ON \`company_page_en_fields\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_page_en_principles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_page_en_principles_order_idx\` ON \`company_page_en_principles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_page_en_principles_parent_id_idx\` ON \`company_page_en_principles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`zh_title\` text,
  	\`zh_description\` text,
  	\`zh_eyebrow\` text,
  	\`zh_headline\` text,
  	\`zh_lede\` text,
  	\`zh_seo_title\` text,
  	\`zh_seo_description\` text,
  	\`zh_seo_no_index\` integer DEFAULT false,
  	\`zh_artwork_alt\` text,
  	\`zh_artwork_caption\` text,
  	\`zh_relationship_title\` text,
  	\`zh_relationship\` text,
  	\`zh_fields_title\` text,
  	\`zh_principles_title\` text,
  	\`zh_mission_title\` text,
  	\`zh_mission\` text,
  	\`zh_cta_title\` text,
  	\`zh_cta_text\` text,
  	\`zh_cta_label\` text,
  	\`en_title\` text,
  	\`en_description\` text,
  	\`en_eyebrow\` text,
  	\`en_headline\` text,
  	\`en_lede\` text,
  	\`en_seo_title\` text,
  	\`en_seo_description\` text,
  	\`en_seo_no_index\` integer DEFAULT false,
  	\`en_artwork_alt\` text,
  	\`en_artwork_caption\` text,
  	\`en_relationship_title\` text,
  	\`en_relationship\` text,
  	\`en_fields_title\` text,
  	\`en_principles_title\` text,
  	\`en_mission_title\` text,
  	\`en_mission\` text,
  	\`en_cta_title\` text,
  	\`en_cta_text\` text,
  	\`en_cta_label\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`company_page__status_idx\` ON \`company_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_company_page_v_version_zh_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_zh_headline_lines_order_idx\` ON \`_company_page_v_version_zh_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_zh_headline_lines_parent_id_idx\` ON \`_company_page_v_version_zh_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_page_v_version_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_zh_seo_keywords_order_idx\` ON \`_company_page_v_version_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_zh_seo_keywords_parent_id_idx\` ON \`_company_page_v_version_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_page_v_version_zh_fields\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_zh_fields_order_idx\` ON \`_company_page_v_version_zh_fields\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_zh_fields_parent_id_idx\` ON \`_company_page_v_version_zh_fields\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_page_v_version_zh_principles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_zh_principles_order_idx\` ON \`_company_page_v_version_zh_principles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_zh_principles_parent_id_idx\` ON \`_company_page_v_version_zh_principles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_page_v_version_en_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_en_headline_lines_order_idx\` ON \`_company_page_v_version_en_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_en_headline_lines_parent_id_idx\` ON \`_company_page_v_version_en_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_page_v_version_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_en_seo_keywords_order_idx\` ON \`_company_page_v_version_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_en_seo_keywords_parent_id_idx\` ON \`_company_page_v_version_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_page_v_version_en_fields\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_en_fields_order_idx\` ON \`_company_page_v_version_en_fields\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_en_fields_parent_id_idx\` ON \`_company_page_v_version_en_fields\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_page_v_version_en_principles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_en_principles_order_idx\` ON \`_company_page_v_version_en_principles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_en_principles_parent_id_idx\` ON \`_company_page_v_version_en_principles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_zh_title\` text,
  	\`version_zh_description\` text,
  	\`version_zh_eyebrow\` text,
  	\`version_zh_headline\` text,
  	\`version_zh_lede\` text,
  	\`version_zh_seo_title\` text,
  	\`version_zh_seo_description\` text,
  	\`version_zh_seo_no_index\` integer DEFAULT false,
  	\`version_zh_artwork_alt\` text,
  	\`version_zh_artwork_caption\` text,
  	\`version_zh_relationship_title\` text,
  	\`version_zh_relationship\` text,
  	\`version_zh_fields_title\` text,
  	\`version_zh_principles_title\` text,
  	\`version_zh_mission_title\` text,
  	\`version_zh_mission\` text,
  	\`version_zh_cta_title\` text,
  	\`version_zh_cta_text\` text,
  	\`version_zh_cta_label\` text,
  	\`version_en_title\` text,
  	\`version_en_description\` text,
  	\`version_en_eyebrow\` text,
  	\`version_en_headline\` text,
  	\`version_en_lede\` text,
  	\`version_en_seo_title\` text,
  	\`version_en_seo_description\` text,
  	\`version_en_seo_no_index\` integer DEFAULT false,
  	\`version_en_artwork_alt\` text,
  	\`version_en_artwork_caption\` text,
  	\`version_en_relationship_title\` text,
  	\`version_en_relationship\` text,
  	\`version_en_fields_title\` text,
  	\`version_en_principles_title\` text,
  	\`version_en_mission_title\` text,
  	\`version_en_mission\` text,
  	\`version_en_cta_title\` text,
  	\`version_en_cta_text\` text,
  	\`version_en_cta_label\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_page_v_version_version__status_idx\` ON \`_company_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_created_at_idx\` ON \`_company_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_updated_at_idx\` ON \`_company_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_latest_idx\` ON \`_company_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_company_page_v_autosave_idx\` ON \`_company_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`contact_page_zh_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_zh_headline_lines_order_idx\` ON \`contact_page_zh_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_zh_headline_lines_parent_id_idx\` ON \`contact_page_zh_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_page_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_zh_seo_keywords_order_idx\` ON \`contact_page_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_zh_seo_keywords_parent_id_idx\` ON \`contact_page_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_page_en_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_en_headline_lines_order_idx\` ON \`contact_page_en_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_en_headline_lines_parent_id_idx\` ON \`contact_page_en_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_page_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page_en_seo_keywords_order_idx\` ON \`contact_page_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_en_seo_keywords_parent_id_idx\` ON \`contact_page_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`zh_title\` text,
  	\`zh_description\` text,
  	\`zh_eyebrow\` text,
  	\`zh_headline\` text,
  	\`zh_lede\` text,
  	\`zh_seo_title\` text,
  	\`zh_seo_description\` text,
  	\`zh_seo_no_index\` integer DEFAULT false,
  	\`zh_company_label\` text,
  	\`zh_phone_label\` text,
  	\`zh_address_label\` text,
  	\`zh_icp_label\` text,
  	\`zh_call_action\` text,
  	\`zh_call_description\` text,
  	\`zh_cooperation_title\` text,
  	\`zh_cooperation_text\` text,
  	\`en_title\` text,
  	\`en_description\` text,
  	\`en_eyebrow\` text,
  	\`en_headline\` text,
  	\`en_lede\` text,
  	\`en_seo_title\` text,
  	\`en_seo_description\` text,
  	\`en_seo_no_index\` integer DEFAULT false,
  	\`en_company_label\` text,
  	\`en_phone_label\` text,
  	\`en_address_label\` text,
  	\`en_icp_label\` text,
  	\`en_call_action\` text,
  	\`en_call_description\` text,
  	\`en_cooperation_title\` text,
  	\`en_cooperation_text\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_page__status_idx\` ON \`contact_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_zh_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_zh_headline_lines_order_idx\` ON \`_contact_page_v_version_zh_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_zh_headline_lines_parent_id_idx\` ON \`_contact_page_v_version_zh_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_zh_seo_keywords_order_idx\` ON \`_contact_page_v_version_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_zh_seo_keywords_parent_id_idx\` ON \`_contact_page_v_version_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_en_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_en_headline_lines_order_idx\` ON \`_contact_page_v_version_en_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_en_headline_lines_parent_id_idx\` ON \`_contact_page_v_version_en_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_en_seo_keywords_order_idx\` ON \`_contact_page_v_version_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_en_seo_keywords_parent_id_idx\` ON \`_contact_page_v_version_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_zh_title\` text,
  	\`version_zh_description\` text,
  	\`version_zh_eyebrow\` text,
  	\`version_zh_headline\` text,
  	\`version_zh_lede\` text,
  	\`version_zh_seo_title\` text,
  	\`version_zh_seo_description\` text,
  	\`version_zh_seo_no_index\` integer DEFAULT false,
  	\`version_zh_company_label\` text,
  	\`version_zh_phone_label\` text,
  	\`version_zh_address_label\` text,
  	\`version_zh_icp_label\` text,
  	\`version_zh_call_action\` text,
  	\`version_zh_call_description\` text,
  	\`version_zh_cooperation_title\` text,
  	\`version_zh_cooperation_text\` text,
  	\`version_en_title\` text,
  	\`version_en_description\` text,
  	\`version_en_eyebrow\` text,
  	\`version_en_headline\` text,
  	\`version_en_lede\` text,
  	\`version_en_seo_title\` text,
  	\`version_en_seo_description\` text,
  	\`version_en_seo_no_index\` integer DEFAULT false,
  	\`version_en_company_label\` text,
  	\`version_en_phone_label\` text,
  	\`version_en_address_label\` text,
  	\`version_en_icp_label\` text,
  	\`version_en_call_action\` text,
  	\`version_en_call_description\` text,
  	\`version_en_cooperation_title\` text,
  	\`version_en_cooperation_text\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_version__status_idx\` ON \`_contact_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_created_at_idx\` ON \`_contact_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_updated_at_idx\` ON \`_contact_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_latest_idx\` ON \`_contact_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_autosave_idx\` ON \`_contact_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`services_page_zh_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_page_zh_headline_lines_order_idx\` ON \`services_page_zh_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_page_zh_headline_lines_parent_id_idx\` ON \`services_page_zh_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_page_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_page_zh_seo_keywords_order_idx\` ON \`services_page_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_page_zh_seo_keywords_parent_id_idx\` ON \`services_page_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_page_en_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_page_en_headline_lines_order_idx\` ON \`services_page_en_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_page_en_headline_lines_parent_id_idx\` ON \`services_page_en_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_page_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_page_en_seo_keywords_order_idx\` ON \`services_page_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_page_en_seo_keywords_parent_id_idx\` ON \`services_page_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`zh_title\` text,
  	\`zh_description\` text,
  	\`zh_eyebrow\` text,
  	\`zh_headline\` text,
  	\`zh_lede\` text,
  	\`zh_seo_title\` text,
  	\`zh_seo_description\` text,
  	\`zh_seo_no_index\` integer DEFAULT false,
  	\`zh_artwork_alt\` text,
  	\`zh_artwork_caption\` text,
  	\`zh_best_for_label\` text,
  	\`zh_deliverables_label\` text,
  	\`zh_process_label\` text,
  	\`zh_evidence_label\` text,
  	\`zh_boundaries_label\` text,
  	\`zh_cta_title\` text,
  	\`zh_cta_text\` text,
  	\`zh_cta_label\` text,
  	\`en_title\` text,
  	\`en_description\` text,
  	\`en_eyebrow\` text,
  	\`en_headline\` text,
  	\`en_lede\` text,
  	\`en_seo_title\` text,
  	\`en_seo_description\` text,
  	\`en_seo_no_index\` integer DEFAULT false,
  	\`en_artwork_alt\` text,
  	\`en_artwork_caption\` text,
  	\`en_best_for_label\` text,
  	\`en_deliverables_label\` text,
  	\`en_process_label\` text,
  	\`en_evidence_label\` text,
  	\`en_boundaries_label\` text,
  	\`en_cta_title\` text,
  	\`en_cta_text\` text,
  	\`en_cta_label\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`services_page__status_idx\` ON \`services_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_services_page_v_version_zh_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_page_v_version_zh_headline_lines_order_idx\` ON \`_services_page_v_version_zh_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_services_page_v_version_zh_headline_lines_parent_id_idx\` ON \`_services_page_v_version_zh_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_services_page_v_version_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_page_v_version_zh_seo_keywords_order_idx\` ON \`_services_page_v_version_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_services_page_v_version_zh_seo_keywords_parent_id_idx\` ON \`_services_page_v_version_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_services_page_v_version_en_headline_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_page_v_version_en_headline_lines_order_idx\` ON \`_services_page_v_version_en_headline_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_services_page_v_version_en_headline_lines_parent_id_idx\` ON \`_services_page_v_version_en_headline_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_services_page_v_version_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_page_v_version_en_seo_keywords_order_idx\` ON \`_services_page_v_version_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_services_page_v_version_en_seo_keywords_parent_id_idx\` ON \`_services_page_v_version_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_services_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_zh_title\` text,
  	\`version_zh_description\` text,
  	\`version_zh_eyebrow\` text,
  	\`version_zh_headline\` text,
  	\`version_zh_lede\` text,
  	\`version_zh_seo_title\` text,
  	\`version_zh_seo_description\` text,
  	\`version_zh_seo_no_index\` integer DEFAULT false,
  	\`version_zh_artwork_alt\` text,
  	\`version_zh_artwork_caption\` text,
  	\`version_zh_best_for_label\` text,
  	\`version_zh_deliverables_label\` text,
  	\`version_zh_process_label\` text,
  	\`version_zh_evidence_label\` text,
  	\`version_zh_boundaries_label\` text,
  	\`version_zh_cta_title\` text,
  	\`version_zh_cta_text\` text,
  	\`version_zh_cta_label\` text,
  	\`version_en_title\` text,
  	\`version_en_description\` text,
  	\`version_en_eyebrow\` text,
  	\`version_en_headline\` text,
  	\`version_en_lede\` text,
  	\`version_en_seo_title\` text,
  	\`version_en_seo_description\` text,
  	\`version_en_seo_no_index\` integer DEFAULT false,
  	\`version_en_artwork_alt\` text,
  	\`version_en_artwork_caption\` text,
  	\`version_en_best_for_label\` text,
  	\`version_en_deliverables_label\` text,
  	\`version_en_process_label\` text,
  	\`version_en_evidence_label\` text,
  	\`version_en_boundaries_label\` text,
  	\`version_en_cta_title\` text,
  	\`version_en_cta_text\` text,
  	\`version_en_cta_label\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_page_v_version_version__status_idx\` ON \`_services_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_services_page_v_created_at_idx\` ON \`_services_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_page_v_updated_at_idx\` ON \`_services_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_page_v_latest_idx\` ON \`_services_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_services_page_v_autosave_idx\` ON \`_services_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`projects_page_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_page_zh_seo_keywords_order_idx\` ON \`projects_page_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_page_zh_seo_keywords_parent_id_idx\` ON \`projects_page_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_page_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_page_en_seo_keywords_order_idx\` ON \`projects_page_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_page_en_seo_keywords_parent_id_idx\` ON \`projects_page_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`zh_title\` text,
  	\`zh_description\` text,
  	\`zh_eyebrow\` text,
  	\`zh_seo_title\` text,
  	\`zh_seo_description\` text,
  	\`zh_seo_no_index\` integer DEFAULT false,
  	\`en_title\` text,
  	\`en_description\` text,
  	\`en_eyebrow\` text,
  	\`en_seo_title\` text,
  	\`en_seo_description\` text,
  	\`en_seo_no_index\` integer DEFAULT false,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_page__status_idx\` ON \`projects_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_projects_page_v_version_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_page_v_version_zh_seo_keywords_order_idx\` ON \`_projects_page_v_version_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_page_v_version_zh_seo_keywords_parent_id_idx\` ON \`_projects_page_v_version_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_page_v_version_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_page_v_version_en_seo_keywords_order_idx\` ON \`_projects_page_v_version_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_page_v_version_en_seo_keywords_parent_id_idx\` ON \`_projects_page_v_version_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_zh_title\` text,
  	\`version_zh_description\` text,
  	\`version_zh_eyebrow\` text,
  	\`version_zh_seo_title\` text,
  	\`version_zh_seo_description\` text,
  	\`version_zh_seo_no_index\` integer DEFAULT false,
  	\`version_en_title\` text,
  	\`version_en_description\` text,
  	\`version_en_eyebrow\` text,
  	\`version_en_seo_title\` text,
  	\`version_en_seo_description\` text,
  	\`version_en_seo_no_index\` integer DEFAULT false,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_page_v_version_version__status_idx\` ON \`_projects_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_projects_page_v_created_at_idx\` ON \`_projects_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_page_v_updated_at_idx\` ON \`_projects_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_page_v_latest_idx\` ON \`_projects_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_projects_page_v_autosave_idx\` ON \`_projects_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`notes_page_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`notes_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`notes_page_zh_seo_keywords_order_idx\` ON \`notes_page_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`notes_page_zh_seo_keywords_parent_id_idx\` ON \`notes_page_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`notes_page_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`notes_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`notes_page_en_seo_keywords_order_idx\` ON \`notes_page_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`notes_page_en_seo_keywords_parent_id_idx\` ON \`notes_page_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`notes_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`zh_title\` text,
  	\`zh_description\` text,
  	\`zh_eyebrow\` text,
  	\`zh_seo_title\` text,
  	\`zh_seo_description\` text,
  	\`zh_seo_no_index\` integer DEFAULT false,
  	\`en_title\` text,
  	\`en_description\` text,
  	\`en_eyebrow\` text,
  	\`en_seo_title\` text,
  	\`en_seo_description\` text,
  	\`en_seo_no_index\` integer DEFAULT false,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`notes_page__status_idx\` ON \`notes_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_notes_page_v_version_zh_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_notes_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_notes_page_v_version_zh_seo_keywords_order_idx\` ON \`_notes_page_v_version_zh_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_notes_page_v_version_zh_seo_keywords_parent_id_idx\` ON \`_notes_page_v_version_zh_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_notes_page_v_version_en_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_notes_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_notes_page_v_version_en_seo_keywords_order_idx\` ON \`_notes_page_v_version_en_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_notes_page_v_version_en_seo_keywords_parent_id_idx\` ON \`_notes_page_v_version_en_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_notes_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_zh_title\` text,
  	\`version_zh_description\` text,
  	\`version_zh_eyebrow\` text,
  	\`version_zh_seo_title\` text,
  	\`version_zh_seo_description\` text,
  	\`version_zh_seo_no_index\` integer DEFAULT false,
  	\`version_en_title\` text,
  	\`version_en_description\` text,
  	\`version_en_eyebrow\` text,
  	\`version_en_seo_title\` text,
  	\`version_en_seo_description\` text,
  	\`version_en_seo_no_index\` integer DEFAULT false,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_notes_page_v_version_version__status_idx\` ON \`_notes_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_notes_page_v_created_at_idx\` ON \`_notes_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_notes_page_v_updated_at_idx\` ON \`_notes_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_notes_page_v_latest_idx\` ON \`_notes_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_notes_page_v_autosave_idx\` ON \`_notes_page_v\` (\`autosave\`);`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`projects_outcomes\`;`)
  await db.run(sql`DROP TABLE \`projects_workflow\`;`)
  await db.run(sql`DROP TABLE \`projects_faq\`;`)
  await db.run(sql`DROP TABLE \`projects_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`projects\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_version_outcomes\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_version_workflow\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_version_faq\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_version_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_projects_v\`;`)
  await db.run(sql`DROP TABLE \`services_deliverables\`;`)
  await db.run(sql`DROP TABLE \`services_process\`;`)
  await db.run(sql`DROP TABLE \`services_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`DROP TABLE \`_services_v_version_deliverables\`;`)
  await db.run(sql`DROP TABLE \`_services_v_version_process\`;`)
  await db.run(sql`DROP TABLE \`_services_v_version_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_services_v\`;`)
  await db.run(sql`DROP TABLE \`notes_tags\`;`)
  await db.run(sql`DROP TABLE \`notes_faq\`;`)
  await db.run(sql`DROP TABLE \`notes_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`notes\`;`)
  await db.run(sql`DROP TABLE \`_notes_v_version_tags\`;`)
  await db.run(sql`DROP TABLE \`_notes_v_version_faq\`;`)
  await db.run(sql`DROP TABLE \`_notes_v_version_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_notes_v\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
  await db.run(sql`DROP TABLE \`site_copy\`;`)
  await db.run(sql`DROP TABLE \`_site_copy_v\`;`)
  await db.run(sql`DROP TABLE \`home_page_zh_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`home_page_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`home_page_zh_method_steps\`;`)
  await db.run(sql`DROP TABLE \`home_page_en_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`home_page_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`home_page_en_method_steps\`;`)
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_zh_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_zh_method_steps\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_en_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_en_method_steps\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v\`;`)
  await db.run(sql`DROP TABLE \`about_page_zh_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`about_page_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`about_page_zh_experience\`;`)
  await db.run(sql`DROP TABLE \`about_page_zh_focus\`;`)
  await db.run(sql`DROP TABLE \`about_page_zh_work\`;`)
  await db.run(sql`DROP TABLE \`about_page_en_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`about_page_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`about_page_en_experience\`;`)
  await db.run(sql`DROP TABLE \`about_page_en_focus\`;`)
  await db.run(sql`DROP TABLE \`about_page_en_work\`;`)
  await db.run(sql`DROP TABLE \`about_page\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_zh_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_zh_experience\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_zh_focus\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_zh_work\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_en_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_en_experience\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_en_focus\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_en_work\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v\`;`)
  await db.run(sql`DROP TABLE \`company_page_zh_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`company_page_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`company_page_zh_fields\`;`)
  await db.run(sql`DROP TABLE \`company_page_zh_principles\`;`)
  await db.run(sql`DROP TABLE \`company_page_en_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`company_page_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`company_page_en_fields\`;`)
  await db.run(sql`DROP TABLE \`company_page_en_principles\`;`)
  await db.run(sql`DROP TABLE \`company_page\`;`)
  await db.run(sql`DROP TABLE \`_company_page_v_version_zh_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`_company_page_v_version_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_company_page_v_version_zh_fields\`;`)
  await db.run(sql`DROP TABLE \`_company_page_v_version_zh_principles\`;`)
  await db.run(sql`DROP TABLE \`_company_page_v_version_en_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`_company_page_v_version_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_company_page_v_version_en_fields\`;`)
  await db.run(sql`DROP TABLE \`_company_page_v_version_en_principles\`;`)
  await db.run(sql`DROP TABLE \`_company_page_v\`;`)
  await db.run(sql`DROP TABLE \`contact_page_zh_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`contact_page_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`contact_page_en_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`contact_page_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`contact_page\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_zh_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_en_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v\`;`)
  await db.run(sql`DROP TABLE \`services_page_zh_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`services_page_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`services_page_en_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`services_page_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`services_page\`;`)
  await db.run(sql`DROP TABLE \`_services_page_v_version_zh_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`_services_page_v_version_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_services_page_v_version_en_headline_lines\`;`)
  await db.run(sql`DROP TABLE \`_services_page_v_version_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_services_page_v\`;`)
  await db.run(sql`DROP TABLE \`projects_page_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`projects_page_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`projects_page\`;`)
  await db.run(sql`DROP TABLE \`_projects_page_v_version_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_projects_page_v_version_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_projects_page_v\`;`)
  await db.run(sql`DROP TABLE \`notes_page_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`notes_page_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`notes_page\`;`)
  await db.run(sql`DROP TABLE \`_notes_page_v_version_zh_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_notes_page_v_version_en_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_notes_page_v\`;`)
}
