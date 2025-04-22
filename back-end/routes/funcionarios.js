// Importando bibliotecas necessárias
import{Router} from 'express';
import controller from '../controllers/funcionarios.js';

const router = Router();

// Rotas

router.post('/', controller.create);
// Dados a serem informados
/*
    nome:  String
    login: String
    senha: String
    nivel: String
*/

router.get('/', controller.retrieveAll);
// Dados a serem informados
/*
    Nenhum dado, somente requisitar na URL normal
*/

router.get('/:id', controller.retrieveOne);
// Dados a serem informados
/*
    id via URL
*/

// (Login)
router.post('/login/', controller.loginFuncionario);
// Dados a serem informados
/*
    login  String
    senha: String
*/

router.put('/:id', controller.update);
// Dados a serem informados
/*
    id via URL
    nome: String
    login: String
    senha: String (Será a nova senha)
    nivel: String (Normal, ADM)
    senha_atual: String (Senha antiga / atual)
*/

router.delete('/:id', controller.delete);
// Dados a serem informados
/*
    id via URL
    senha_atual: String (Senha antiga / atual)
*/


router.put('/UpdFunc/:id', controller.updateAdmFunc);
// Dados a serem informados
/*
    id via URL
    nome: String
    login: String
    nivel: String
    senha: String (Será a nova senha)
*/


router.delete('/DelFunc/:id', controller.deleteAdmFunc);
// Dados a serem informados
/*
    id via URL
*/

router.get('/encerrarSessao/true', controller.encerrarSessao);
// Dados a serem informados
/*
    Nenhum dado, somente a URL corretamente
*/

export default router;