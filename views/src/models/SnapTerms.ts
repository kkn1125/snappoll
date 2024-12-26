import { SnapTermsSection } from "./SnapTermsSection";

export class SnapTerms {
  id!: string;
  isActive!: boolean;
  version!: string;
  createdAt!: Date;
  updatedAt!: Date;

  termsSection!: SnapTermsSection[];
}
