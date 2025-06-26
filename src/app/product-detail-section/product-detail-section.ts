import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchProudcts } from '../services/fetch-proudcts';
import { CartHandling } from '../services/cart-handling';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  availabilityStatus: 'In Stock' | 'Low in Stock' | 'Not in Stock';
  images: string[];
  thumbnail: string;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-section.html',
  styleUrls: ['./product-detail-section.scss']
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(FetchProudcts);
  private cartService = inject(CartHandling);

  product!: Product;
  selectedImage = '';
  quantity = 1;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getProductById(id).subscribe((res: Product) => {
        this.product = res;
        this.selectedImage = res.thumbnail || res.images?.[0] || '';
      });
    }
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product.availabilityStatus === 'Not in Stock') return;

    const productWithQty = {
      ...this.product,
      quantity: this.quantity
    };

    this.cartService.addToCart(productWithQty);
  }
}
