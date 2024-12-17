import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { PessoasService } from 'src/app/pessoas/pessoas.service';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class IsAdminGuard implements CanActivate {
    constructor(private pessoasService: PessoasService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        console.log('Guard...');
        const { authorization } = context.switchToHttp().getRequest().headers;
        console.log('authorization no Guard: ', authorization);

        // Aqui, teoricamente o guard faria uma busca em pessoa Service e verificaria o perfil do login e a rota.
        return from(this.pessoasService.findOne(14)).pipe(
            tap((p) => console.log('pessoa', p)),
            map((pessoa) => !!pessoa),
            catchError((err) => {
                console.error('Erro ao buscar pessoa:', err);
                return of(/* false */ true);
            }),
        );
    }
}