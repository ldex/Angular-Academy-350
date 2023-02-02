import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.interface';
import { ProductService } from 'src/app/services/product.service';

interface ProductForm {
  name: FormControl<string>;
  price: FormControl<number>;
  description: FormControl<string>;
  imageUrl: FormControl<string>;
  discontinued: FormControl<boolean>;
  fixedPrice: FormControl<boolean>;
  modifiedDate: FormControl<Date>;
}


@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.css']
})
export class ProductInsertComponent {

  insertForm: FormGroup<ProductForm>;

  get name() { return this.insertForm.get('name'); }
  get price() { return this.insertForm.get('price'); }
  get description() { return this.insertForm.get('description'); }
  get imageUrl() { return this.insertForm.get('imageUrl'); }

  onSubmit() {
    const newProduct: Product = this.insertForm.getRawValue();
    this
      .productService
      .insertProduct(newProduct)
      .subscribe(
        product => {
          console.log('Product saved on server with id: ' + product.id);
          this.productService.initProducts();
          this.router.navigateByUrl('/products');
        }
      )
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    const validImgUrlRegex: RegExp = new RegExp('^(https?://[a-zA-Z0-9-.]+.[a-zA-Z]{2,5}(?:/S*)?(?:[-A-Za-z0-9+&@#/%?=~_|!:,.;])+.(?:jpg|jpeg|gif|png))$');

    this.insertForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.maxLength(50)]],
        price: [null as number, [Validators.required, Validators.min(0), Validators.max(10000000)]],
        description: ['', [Validators.minLength(5), Validators.maxLength(100)]],
        imageUrl: ['', [Validators.pattern(validImgUrlRegex)]],
        discontinued: [false],
        fixedPrice: [false],
        modifiedDate: [null]
      }
    );
  }

}
