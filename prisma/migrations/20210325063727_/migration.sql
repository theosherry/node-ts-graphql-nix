/*
  Warnings:

  - The migration will change the primary key for the `Author` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will change the primary key for the `Book` table. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Author" ("id", "name") SELECT "id", "name" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);
INSERT INTO "new_Book" ("id", "title") SELECT "id", "title" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE TABLE "new__AuthorToBook" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__AuthorToBook" ("A", "B") SELECT "A", "B" FROM "_AuthorToBook";
DROP TABLE "_AuthorToBook";
ALTER TABLE "new__AuthorToBook" RENAME TO "_AuthorToBook";
CREATE UNIQUE INDEX "_AuthorToBook_AB_unique" ON "_AuthorToBook"("A", "B");
CREATE INDEX "_AuthorToBook_B_index" ON "_AuthorToBook"("B");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
