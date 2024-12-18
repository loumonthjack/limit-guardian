export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  newService?: Maybe<Service>;
};


export type MutationNewServiceArgs = {
  adminEmail: Scalars['String']['input'];
  description: Scalars['String']['input'];
  isEnabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  rateLimit: Scalars['Int']['input'];
  rateLimitPeriod: RateLimitPeriod;
};

export type Query = {
  __typename?: 'Query';
  service?: Maybe<Service>;
  services: Array<Service>;
};


export type QueryServiceArgs = {
  name: Scalars['String']['input'];
};

export enum RateLimitPeriod {
  Day = 'DAY',
  Hour = 'HOUR',
  Minute = 'MINUTE',
  Month = 'MONTH',
  Second = 'SECOND',
  Week = 'WEEK',
  Year = 'YEAR'
}

export type Service = {
  __typename?: 'Service';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  isEnabled: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  period: RateLimitPeriod;
  resetAt: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  usage: Scalars['Int']['output'];
};
