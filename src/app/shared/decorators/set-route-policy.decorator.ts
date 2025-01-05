import { SetMetadata } from '@nestjs/common';
import { TiposRolesEnum } from 'src/app/roles/model/tipos-roles.enum';

export const SetRoutePolicy = (role: TiposRolesEnum, nomeRota: string) => {
    return SetMetadata(role, nomeRota);
};
