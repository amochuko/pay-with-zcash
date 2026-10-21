export enum POST_STATUS_ENUM {
  PUBLISH = "publish",
  REVIEW = "review",
  DRAFT = "draft",
}

export type SignupFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type LoginStateForm =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
