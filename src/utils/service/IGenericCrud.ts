export interface IGenericCreate<T> {
  create(data: T): Promise<T>;
}
export interface IGenericList<T> {
  getAll(page: number, limit: number, filter: any): Promise<T[]>;
}
export interface IGenericRemove {
  remove(id: string): Promise<any>;
}

export interface IGenericCrud<T> extends IGenericCreate<T>, IGenericList<T> {
  getDetail(id: string): Promise<T>;
  remove(id: string): Promise<void>;
  edit(id: string, data: T): Promise<T>;
}
