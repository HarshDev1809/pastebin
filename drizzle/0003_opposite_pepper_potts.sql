ALTER TABLE "pastes" RENAME TO "snippets";
ALTER TABLE "snippets" ADD COLUMN "language" text DEFAULT 'plaintext' NOT NULL;
