import { TagType } from '@prisma/client';
import { ModifiedCommandInteraction } from './';

export interface TagProps {
    name: string;
    type: TagType;
    ownerId: string;
    content: string;
    interaction: ModifiedCommandInteraction;
}
