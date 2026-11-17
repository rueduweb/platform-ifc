import { Team } from "../../../../shared/ui/championship-ranking/models/team.model";

export type TeamUpdate = Partial<
  Pick<
    Team,
    | 'name'
    | 'nbW'
    | 'nbD'
    | 'nbL'
    | 'nbForfeit'
    | 'nbGoal'
    | 'nbConce'
    | 'penalty'
  >
>;
