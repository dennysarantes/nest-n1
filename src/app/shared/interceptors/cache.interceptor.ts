import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { of, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    private readonly cache = new Map<string, any>();

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        console.log('SimpleCacheInterceptor executado ANTES');
        const request = context.switchToHttp().getRequest();
        const url = request.url;

        if (this.cache.has(url)) {
            console.log('Está no cache', url);
            return of(this.cache.get(url));
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));

        return next.handle().pipe(
            tap((data) => {
                this.cache.set(url, data);
                console.log('Armazenado em cache', url);
            }),
        );
    }
}
