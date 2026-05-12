import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_KEY = 'ownership';

export const CheckOwnership = (entity: 'pet' | 'vaccine' | 'weight') =>
  SetMetadata(OWNERSHIP_KEY, entity);
