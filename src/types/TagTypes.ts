import { TagType } from '@prisma/client';
import { ModifiedChatInputCommandInteraction } from './';

export interface TagProps {
    name: string;
    type: TagType;
    ownerId: string;
    content: string;
    interaction: ModifiedChatInputCommandInteraction;
}
