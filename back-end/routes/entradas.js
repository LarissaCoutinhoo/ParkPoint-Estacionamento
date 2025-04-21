// Importando bibliotecas necessárias
import{Router} from 'express';
import controller from '../controllers/entradas.js';

const router = Router();

// Rotas

router.post('/', controller.entrada);
// Dados a serem informados
/*
    placa:        String (Veiculo)
    cpf:          String (Cliente)
    valor_hora:   String 
*/

router.get('/placa/:placa', controller.retrieveOnePlaca);
// Dados a serem informados
/*
    placa Via URL
*/

router.get('/AllPlaca/:placa', controller.retrieveAllPlaca);
// Dados a serem informados
/*
    placa Via URL
*/

router.get('/AllCliente/:cpf', controller.retrieveAllClienteCpf);
// Dados a serem informados
/*
    cpf Via URL
*/

router.get('/alocados/all/', controller.retrieveAllAlocados);
// Dados a serem informados
/*
    Nenhum dado necessário
*/

router.get('/cancelados/all/', controller.retrieveAllCancelados);
// Dados a serem informados
/*
    Nenhum dado necessário
*/

router.get('/finalizados/all/', controller.retrieveAllFinalizados);
// Dados a serem informados
/*
    Nenhum dado necessário
*/

router.get('/:id', controller.retrieveOne);
// Dados a serem informados
/*
    id Via URL
*/

router.get('/', controller.retrieveAll);
// Dados a serem informados
/*
    Nenhum dada a ser enviado
*/

router.put('/:id', controller.update);
// Dados a serem informados
/*
    placa:        String (Veiculo)
    cpf:          String (Cliente)
    status:       String (Alocado, Cancelado, Finalizado)
    valor_hora:   String 
*/

router.put('/sair/:id', controller.saida);
// Dados a serem informados
/*
    Somente Id via URL
*/

router.put('/cancelar/:id', controller.cancelar);
// Dados a serem informados
/*
    Somente Id via URL
*/

export default router;