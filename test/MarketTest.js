const {expect} = require('chai');

describe("NFTMarket", function(){
    
    beforeEach(async function() {
        [this.addressA, this.addressB] = await hre.ethers.getSigners();
        this.Market = await hre.ethers.getContractFactory("NFTMarket");
        this.market = await this.Market.deploy();
        await this.market.deployed();
        this.marketAddress = this.market.address; 

        this.NFT = await ethers.getContractFactory("NFT");
        this.nft = await this.NFT.deploy(this.marketAddress);
        await this.nft.deployed()
        this.nftContractAddress = this.nft.address;
    });

    it("Should create nft token", async function() {
        await this.nft.createToken("a");
        await this.nft.createToken("b");
        await this.nft.createToken("c");
    });

    it("Should create a item in the market", async function() {
        await this.nft.createToken("a");
        await this.nft.createToken("b");
        await this.nft.createToken("c");
        await this.market.createMarketItem(this.nftContractAddress, 1, 10);
        await this.market.createMarketItem(this.nftContractAddress, 2, 300);
        await this.market.createMarketItem(this.nftContractAddress, 3, 150);
    })

    it("Should sell the NFT to de buyer", async function() {
        await this.nft.createToken("a");
        await this.nft.createToken("b");
        await this.nft.createToken("c");
        await this.market.createMarketItem(this.nftContractAddress, 1, 10);
        await this.market.createMarketItem(this.nftContractAddress, 2, 300);
        await this.market.createMarketItem(this.nftContractAddress, 3, 150);
        await this.market.connect(this.addressB).createMarketSale(this.nftContractAddress, 1, {value: 10})
        await this.market.connect(this.addressB).createMarketSale(this.nftContractAddress, 2, {value: 300})
        await this.market.connect(this.addressB).createMarketSale(this.nftContractAddress, 3, {value: 150})
    })

    it("Should fetch Nfts", async function(){
        await this.nft.createToken("a")
        await this.nft.createToken("b")
        await this.nft.createToken("c")
  
        await this.market.createMarketItem(this.nftContractAddress, 1, 10)
        await this.market.createMarketItem(this.nftContractAddress, 2, 300)
        await this.market.createMarketItem(this.nftContractAddress, 3, 150)
        
        await this.market.connect(this.addressB).createMarketSale(this.nftContractAddress, 1, {value: 10})
        await this.market.connect(this.addressB).createMarketSale(this.nftContractAddress, 2, {value: 300})
        await this.market.connect(this.addressB).createMarketSale(this.nftContractAddress, 3, {value: 150})
        items = await this.market.fetchMarketItems()
        items = await Promise.all(items.map(async i => {
        const tokenUri = await this.nft.tokenURI(i.tokenId)
        let item = {
        price: i.price.toNumber(),
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
        }
        return item
        }))
    console.log('items: ', items)

    const myNfts = await this.market.connect(this.addressB).fetchMyNFTs()
    console.log('myNfts:', myNfts.length);
    })


})