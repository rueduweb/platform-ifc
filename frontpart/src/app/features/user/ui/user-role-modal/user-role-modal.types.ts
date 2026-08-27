import { UserModel } from "../../data/models/user.model";

export type SaveRoleResult = { // la réponse du parent vers le modal
  success: boolean;
  error?: string;
};

export type SaveRoleEvent = { // la demande du modal vers le parent.
  role: UserModel['role'];
  resolve: (result: SaveRoleResult) => void;
};
