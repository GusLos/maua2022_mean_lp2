import { Injectable } from "@angular/core";
import { Cliente } from "./cliente.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private clientes: Cliente[] = [];
  private listaClientesAtualizada = new Subject<Cliente[]>();

  constructor(private httpClient: HttpClient){}

  getClientes(): void {
    this.httpClient.get<{mensagem: string, clientes: any}>('http://localhost:3000/api/clientes')
      //no pipe, transformar/mapear [{_id: 1, nome: 1, email: j@email.com}], ... --para--> [{id: 1, nome: 1, email: j@email.com}]
      .pipe(map((dados) => {
        return dados.clientes.map(cliente => {
          return {id: cliente._id, nome: cliente.nome, fone: cliente.fone, email: cliente.email}
        })
      }))
      .subscribe(
        (clientes) => {
          this.clientes = clientes;
          this.listaClientesAtualizada.next([...this.clientes]);
        }
      )
  }

  adicionarCliente(nome: string, fone: string, email:string){
    const cliente: Cliente = {
      nome: nome,
      fone: fone,
      email: email,
    };
    this.httpClient.post<{mensagem: string, id: string}>('http://localhost:3000/api/clientes',
    cliente).subscribe(
      (dados) => {
        console.log(dados.mensagem);
        cliente.id = dados.id;
        this.clientes.push(cliente);
        this.listaClientesAtualizada.next([...this.clientes]);
      }
    )
  }

  removerCliente (id: string): void {
    this.httpClient.delete(`http://localhost:3000/api/clientes/${id}`).subscribe(() => {
      console.log(`Cliente de id: ${id} removido`)
    })

  }

  getCliente(idCliente: string){
    // return {...this.clientes.find(cli => cli.id === idCliente)};
    return this.httpClient.get<{_id: string, nome: string, fone: string, email: string}>
    (`http://localhost:3000/api/clientes/${idCliente}`)
  }

  atualizarCliente(id: string, nome: string, fone: string, email: string){
    const cliente: Cliente = {id, nome, fone, email}; // pq -> {id: id, nome: nome, fone: fone, email: email}
    this.httpClient.put(`http://localhost:3000/api/cliente/${id}`, cliente)
    .subscribe(res => {
      const copia = [...this.clientes]
      const indice = copia.findIndex(cli => cli.id === cliente.id)
      copia[indice] = cliente
      this.clientes = copia
      this.listaClientesAtualizada.next([...this.clientes])
    })
  }

  getListaDeClientesAtualizadaObservable(){
    return this.listaClientesAtualizada.asObservable();
  }
}
