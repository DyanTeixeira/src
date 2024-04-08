import "./index.css";
import clienteService from "../../services/cliente-service";
import Swal from "sweetalert2";
import Cliente from "../../models/Cliente";
import { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [cliente, setCliente] = useState(new Cliente());
    const [modoEdicao, setModoEdicao] = useState(false);

    useEffect(() => {
        // Carregar clientes quando o componente for montado
        clienteService.obter()
            .then((response) => {
                setClientes(response.data);
            })
            .catch(erro => { })
    }, []);

    const editar = (e) => {
        // Editar um cliente
        setModoEdicao(true);
        let clienteParaEditar = clientes.find(c => c.id === parseInt(e.target.id));
        clienteParaEditar.dataCadastro = clienteParaEditar.dataCadastro.substring(0, 10);

        setCliente(clienteParaEditar);
    }

    const excluirClienteNaLista = (cliente) => {
        let indice = clientes.findIndex(c => c.id == cliente.id);

        clientes.splice(indice, 1);

        setClientes(arr => [...arr]);
    }

    const excluir = (e) => {
        let clienteParaExcluir = clientes.find(p => p.id == e.target.id);

        // eslint-disable-next-line no-restricted-globals
        if (clienteParaExcluir) {
            Swal.fire({
                icon: 'warning',
                text: `Deseja realmente excluir o cliente ${clienteParaExcluir.nome}?`,
                showCancelButton: true,
                confirmButtonText: 'Sim',
                confirmButtonColor:'#007bff',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#dc3545'
            }).then((result) => {
                if (result.isConfirmed) {
                    clienteService.excluir(clienteParaExcluir.id)
                    excluirClienteNaLista(clienteParaExcluir);
                }
            });
        }
    };

    const salvar = () => {
        // Salvar um cliente
        if (!cliente.email || !cliente.cpfOuCnpj) {
            Swal.fire({
                icon: 'error',
                text: 'E-mail e CPF são obrigatórios.'
            });
            return;
        }

        modoEdicao ? atualizarClienteNoBackend(cliente) : adicionarClienteNoBackend(cliente);
    }

    const atualizarClienteNoBackend = (cliente) => {
        // Atualizar um cliente no backend
        clienteService.atualizar(cliente)
            .then(response => {
                limparModal();

                Swal.fire({
                    icon: 'success',
                    title: `Cliente ${cliente.nome}, foi atualizado com sucesso!`,
                    showConfirmButton: false,
                    timer: 5000
                })

                const indice = clientes.findIndex(c => c.id === cliente.id);
                const novaListaClientes = [...clientes];
                novaListaClientes[indice] = cliente;
                setClientes(novaListaClientes);
            })
    }

    const adicionar = () => {
        // Adicionar um novo cliente
        setModoEdicao(false);
        limparModal();
    }

    const limparModal = () => {
        // Limpar modal de cliente com react
        setCliente({
           ...cliente,
           id: '',
           nome: '',
           cpfOuCnpj: '',
           telefone: '',
           dataCadastro: '',
           email: ''
       });
   }
    const adicionarClienteNoBackend = (cliente) => {
        // Adicionar um cliente no backend
        clienteService.adicionar(cliente)
            .then(response => {
                setClientes([...clientes, new Cliente(response.data)]);
                limparModal();

                Swal.fire({
                    icon: 'success',
                    title: `Cliente ${cliente.nome}, foi cadastrado com sucesso!`,
                    showConfirmButton: false,
                    timer: 6000
                })
            })
    }

    return (
        <div className="container shadow p-3 mb-5 bg-body rounded">
            {/* Titulo */}
            <div className="row">
                <div className="col-sm-12">
                    <h4>Clientes</h4>
                    <hr />
                </div>
            </div>

            {/* Botão para adicionar */}
            <div className="row">
                <div className="col-sm-3">
                    <button onClick={adicionar} id="btn-adicionar" className="btn btn-primary btn-sm shadow-sm" data-bs-toggle="modal"
                        data-bs-target="#modal-cliente"><FaPlus /> Adicionar</button>
                </div>
            </div>

            {/* Tabela */}
            <div className="row mt-3">
                <div className="col-sm-12">
                    <table className="table table-striped table-hover shadow-sm">
                    <thead class="thead-dark">
                            <tr>
                                <th style={{backgroundColor:"#007bff"}} >Id</th>
                                <th style={{backgroundColor:"#007bff"}} >Nome</th>
                                <th style={{backgroundColor:"#007bff"}}>CPF</th>
                                <th style={{backgroundColor:"#007bff"}}> E-mail</th>
                                <th style={{backgroundColor:"#007bff"}}>Telefone</th>
                                <th style={{backgroundColor:"#007bff"}}>Cadastro </th>
                                <th style={{backgroundColor:"#007bff"}}>Editar</th>
                                <th style={{backgroundColor:"#007bff"}}>Excluir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.id}</td>
                                    <td>{cliente.nome}</td>
                                    <td>{cliente.cpfOuCnpj}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.telefone}</td>
                                    <td>{new Date(cliente.dataCadastro).toLocaleDateString()}</td>
                                    <td>
                                        <button style={{width:"60px"}} id={cliente.id} onClick={editar} className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal"
                                            data-bs-target="#modal-cliente">
                                            <FaEdit  style={{pointerEvents:"none"}}/>
                                        </button>
                                        </td>
                                    
                                    <td>
                                        <button style={{width:"60px"}}id={cliente.id} onClick={excluir} className="btn btn-outline-danger btn-sm">
                                            <FaTrashAlt style={{pointerEvents:"none",}}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* The Modal */}
            <div className="modal" id="modal-cliente">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 style={{color:"white", fontWeight: "bold"}} className="modal-title">{modoEdicao ? 'Editar cliente' : 'Adicionar cliente'}</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        {/* Modal body */}
                        <div className="modal-body">
                            {/* Formulário */}
                            <div className="row">
                                <div className="col-sm-2">
                                    <label htmlFor="id" className="form-label">Id</label>
                                    <input
                                        id="id"
                                        type="text"
                                        disabled
                                        className="form-control"
                                        value={cliente.id}
                                        onChange={(e) => setCliente({ ...cliente, id: e.target.value })}
                                    />
                                </div>
                                <div className="col-sm-10">
                                    <label htmlFor="nome" className="form-label">Nome</label>
                                    <input id="nome" type="text" className="form-control"
                                        value={cliente.nome}
                                        onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-sm-4">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input id="email" type="text" className="form-control"
                                        value={cliente.email}
                                        onChange={(e) => setCliente({ ...cliente, email: e.target.value })} />
                                </div>
                                <div className="col-sm-2">
                                    <label htmlFor="telefone" className="form-label">Telefone</label>
                                    <input id="telefone" type="text" className="form-control"
                                        value={cliente.telefone}
                                        onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })} />
                                </div>
                                <div className="col-sm-3">
                                    <label htmlFor="cpf" className="form-label">CPF</label>
                                    <input id="cpf" type="text" className="form-control" maxLength="14"
                                        value={cliente.cpfOuCnpj}
                                        onChange={(e) => setCliente({ ...cliente, cpfOuCnpj: e.target.value })} />
                                </div>
                                <div className="col-sm-3">
                                    <label htmlFor="dataCadastro" className="form-label">Data de Cadastro</label>
                                    <input id="dataCadastro" type="date" className="form-control"
                                        value={cliente.dataCadastro}
                                        onChange={(e) => setCliente({ ...cliente, dataCadastro: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        {/* Modal footer */}
                        <div className="modal-footer">
                            <button onClick={salvar} id="btn-salvar" type="button" className="btn btn-primary btn-sm">Salvar</button>
                            <button id="btn-cancelar" type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}