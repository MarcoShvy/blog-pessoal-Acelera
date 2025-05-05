import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-editar-post',
  templateUrl: './editar-post.component.html',
  styleUrls: ['./editar-post.component.scss']
})
export class EditarPostComponent {
  postEditado: Post;

  constructor(
    public dialogRef: MatDialogRef<EditarPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post
  ) {
    this.postEditado = { ...data };
  }

  salvar(): void {
    this.dialogRef.close(this.postEditado);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
