// Importando bibliotecas necessárias
import{Router} from 'express';
import controller from '../controllers/clientes.js';

const router = Router();

// Rotas

router.post('/', controller.create);
// Dados a serem informados
/*
    nome:       String
    cpf:        String
    observacao: String (Opcional)
*/

router.get('/cpf/:cpf', controller.retrieveOneCpf);
// Dados a serem informados
/*
    cpf Via URL
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
    nome:       String
    cpf:        String
    status:     Boolean (false - Cancelado) ou (true - Ativo)
    observacao: String (Opcional)
*/

router.delete('/:id', controller.delete);
// Dados a serem informados
/*
    id Via URL
    observacao: String (Opcional) - Informando o motivo do cancelamento
*/

export default router;