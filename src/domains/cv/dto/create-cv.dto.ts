import { PersonalInfo, Experience, Education, Skill, Project, Award, Language, Interest, Course, Organization, Publication, Declaration, CustomSection, Reference } from "src/models/cv-block.model";

export class CreateCvDto {
    userId: string;
    name: string;
    theme: {};
    blocks: PersonalInfo & (Experience | Education | Skill | Project | Award | Language | Interest | Course | Organization | Publication | Reference | CustomSection | Declaration)[];
}
