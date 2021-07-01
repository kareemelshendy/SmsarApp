import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { TransactionService } from "src/app/operations-page/transaction.service";
import { DataStorageService } from "src/app/shared/data-storage.service";
import { Clients } from "../client.model";
import { ClientsService } from "../client.service";

@Component({
  selector: "app-home-detail",
  templateUrl: "./home-detail.component.html",
  styleUrls: ["./home-detail.component.scss"],
})
export class HomeDetailComponent implements OnInit {
  pager = {};
  clients: Clients[];
  pageOfItems = [];
  searchValue = '';
  isLoading = false;

  currentPage;
  pages;
  totalPages

  @Input() index: number;



  subscription: Subscription;
  constructor(
    private clientServic: ClientsService,
    private dataStorageService: DataStorageService,
    private __http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    // this.dataStorageService.fetchClient().subscribe();
    this.route.queryParams.subscribe((x) => {
      this.loadPage(x.page || 1);
    });
    this.clients = this.clientServic.getClients();
    console.log(this.clients);
    this.subscription = this.clientServic.clientsChanged.subscribe(
      (clients: Clients[]) => {
        this.clients = clients;
        // console.log(this.clients);
      }
    );
  }

  private loadPage(page, ) {
    // get page of items from api
    // if(!this.searchValue){
    //   this.searchValue=''
    // }
    const userData: {
      name: string;
      role: string;
      __token: string;
    } = JSON.parse(localStorage.getItem("userData"));

    let reqHeader= new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${userData.__token}`
    })
    this.__http
      .get<any>(`https://clerk-new.herokuapp.com/client/?page=${page}&nationalId=${this.searchValue}`,{headers:reqHeader})
      .subscribe((x) => {
        this.clientServic.setClients(x);
        this.pager = x
        this.clients = x.pageOfItems;
        this.currentPage = x.currentPage;
        this.totalPages = x.totalPages;
        this.pages = x.pages
        
      });
  }
  onNavigate(page) {
    this.router.navigate([`/home`], {
      queryParams: {
        page: page,
        // nationalId:searchVlaue
      },
    });
  }
  onSearch(searchVlaue){
    // setTimeout(()=>{
    //   this.isLoading = true
    // },2000)
    
    this.router.navigate([`/home`], {
      queryParams: {
        nationalId:searchVlaue
      },
    });
    this.isLoading = false
  }

  // private loadPage(page){
  //   this.__http.get<any>(`https://clerk-new.herokuapp.com/?page=${page}`).subscribe(x=>{
  //     // console.log(x)
  //     this.pageOfItems= x.pageOfItems;
  //   })
  // }
  // getPage(page) {
  //   const url = `https://clerk-new.herokuapp.com/client?page=${page}&size=${this.itemsPerPage}`;
  //   this.__http.get(url).subscribe((clients: any) => {
  //     console.log(clients);
  //     this.clients = clients;
  //   });
  // }

  onDelete(i) {
    if (confirm("are you sure to delete?")) {
      let _id = this.clientServic.getClient(i)._id;
      this.dataStorageService.deleteClient(_id);
    }
    this.clientServic.deleteClient(i);
  }

  onShow(i) {
    this.clientServic.startShow.next(i);
    document.documentElement.scrollTop = 49; 
  }

  // onSelectFile(event) {
  //   if (event.target.files && event.target.files[0]) {
  //     var filesAmount = event.target.files.length;
  //     for (let i = 0; i < filesAmount; i++) {
  //       var reader = new FileReader();

  //       reader.onload = (event: any) => {
  //         // console.log(event.target.result);
  //         this.urls.push(event.target.result);
  //       }

  //       reader.readAsDataURL(event.target.files[i]);
  //     }
  //   }
  // }

  // Search() {
  //   if (!this.clients || !this.searchValue) {
  //     return this.clients
  //   }return this.clients.filter(res =>{
  //     res.name.toLowerCase().match(this.searchValue.toLocaleLowerCase());

  //   })
  // }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
