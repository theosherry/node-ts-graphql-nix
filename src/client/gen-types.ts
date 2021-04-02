import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  author?: Maybe<Author>;
  authors: Array<Author>;
  books: Array<Book>;
};


export type QueryAuthorArgs = {
  id: Scalars['ID'];
};


export type QueryBooksArgs = {
  author?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAuthor?: Maybe<Author>;
  updateAuthor?: Maybe<Author>;
  createBook?: Maybe<Book>;
  updateBook?: Maybe<Book>;
  deleteAuthor?: Maybe<Scalars['ID']>;
  deleteBook?: Maybe<Scalars['ID']>;
};


export type MutationCreateAuthorArgs = {
  input: AuthorCreateInput;
};


export type MutationUpdateAuthorArgs = {
  input: AuthorUpdateInput;
};


export type MutationCreateBookArgs = {
  input: BookCreateInput;
};


export type MutationUpdateBookArgs = {
  input: BookUpdateInput;
};


export type MutationDeleteAuthorArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteBookArgs = {
  id: Scalars['ID'];
};

export type BookCreateInput = {
  title: Scalars['String'];
  authors?: Maybe<Array<Scalars['ID']>>;
};

export type BookUpdateInput = {
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  addAuthors?: Maybe<Array<Scalars['ID']>>;
  removeAuthors?: Maybe<Array<Scalars['ID']>>;
};

export type Book = {
  __typename?: 'Book';
  id: Scalars['ID'];
  title: Scalars['String'];
  authors: Array<Author>;
};

export type AuthorCreateInput = {
  name: Scalars['String'];
  books?: Maybe<Array<Scalars['ID']>>;
};

export type AuthorUpdateInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  addBooks?: Maybe<Array<Scalars['ID']>>;
  removeBooks?: Maybe<Array<Scalars['ID']>>;
};

export type Author = {
  __typename?: 'Author';
  id: Scalars['ID'];
  name: Scalars['String'];
  books: Array<Book>;
};

export type GetAuthorQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAuthorQuery = (
  { __typename?: 'Query' }
  & { author?: Maybe<(
    { __typename?: 'Author' }
    & Pick<Author, 'name'>
    & { books: Array<(
      { __typename?: 'Book' }
      & Pick<Book, 'id' | 'title'>
    )> }
  )> }
);


export const GetAuthorDocument: DocumentNode<GetAuthorQuery, GetAuthorQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuthor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"books"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]};