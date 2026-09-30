
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException) //- Este filtro captura errores que vienen de comunicación entre microservicios (RpcException) // Solo atrapa este tipo de excepción
export class RpcCustomExceptionFilter implements ExceptionFilter {

  catch(exception: RpcException, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse(); // Obtiene el response HTTP

    const rpcError = exception.getError()

    console.log(rpcError.toString())

    if(rpcError.toString().includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1)
      })
    }

    if( typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError) {
      const status = isNaN(+rpcError.status!) ? 400 : +rpcError.status!;
      return response.status(status).json(rpcError) // Respeta el status original
    }

    console.log(rpcError)

    response.status(401).json({
      status: 401,
      message: 'Hola people'
    })

  }

}
