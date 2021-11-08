// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract EtherCubes is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    string public baseTokenURI;
    bool public paused = false;

    string public constant BASE_URI_PREFIX = "ipfs://";
    uint256 public constant MAX_PER_MINT = 20;
    uint256 public constant MAX_SUPPLY = 777;
    uint256 public constant COST = .01 ether;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _cid
    ) ERC721(_name, _symbol) {
        setBaseURI(string(abi.encodePacked(BASE_URI_PREFIX, _cid, "/")));
        flipPauseStatus();
    }

    event CreateNFT(uint256 indexed id);

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function mint(uint256 _mintAmount) public payable {
        uint256 supply = _tokenId.current();
        require(_mintAmount > 0, "Must mint at least one");
        require(_tokenId.current() <= MAX_SUPPLY, "Sold out");
        require(
            supply + _mintAmount <= MAX_SUPPLY,
            "Not enough tokens remaining"
        );

        if (msg.sender != owner()) {
            require(!paused, "Contract is paused");
            require(_mintAmount <= MAX_PER_MINT, "Exceeds mint limit");
            require(msg.value >= _mintAmount * COST, "Ethereum cost invalid");
        }

        address _to = msg.sender;
        for (uint256 i = 0; i < _mintAmount; i++) {
            _mint(_to);
        }
    }

    function _mint(address _to) private {
        uint256 id = _tokenId.current();
        _tokenId.increment();
        _safeMint(_to, id);
        emit CreateNFT(id);
    }

    function walletOfOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function withdrawAll() public payable onlyOwner {
        (bool success, ) = payable(_msgSender()).call{
            value: address(this).balance
        }("");
        require(success, "Transfer Failed");
    }

    function flipPauseStatus() public onlyOwner {
        paused = !paused;
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
