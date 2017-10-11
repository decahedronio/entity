"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Entity_1 = require("../src/Entity");
var Type_1 = require("../src/support/Type");
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = null;
        _this.email = null;
        _this.daysAvailable = [];
        return _this;
    }
    return User;
}(Entity_1.Entity));
var Address = (function (_super) {
    __extends(Address, _super);
    function Address() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.street = null;
        _this.city = null;
        _this.zip = null;
        _this.country = null;
        return _this;
    }
    return Address;
}(Entity_1.Entity));
var Post = (function (_super) {
    __extends(Post, _super);
    function Post() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = null;
        _this.content = null;
        return _this;
    }
    return Post;
}(Entity_1.Entity));
var UserWithAddress = (function (_super) {
    __extends(UserWithAddress, _super);
    function UserWithAddress() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.address = null;
        return _this;
    }
    return UserWithAddress;
}(User));
var UserWithAnnotatedAddress = (function (_super) {
    __extends(UserWithAnnotatedAddress, _super);
    function UserWithAnnotatedAddress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Type_1.Type(Address),
        __metadata("design:type", Address)
    ], UserWithAnnotatedAddress.prototype, "address", void 0);
    return UserWithAnnotatedAddress;
}(User));
var UserWithAnnotatedPosts = (function (_super) {
    __extends(UserWithAnnotatedPosts, _super);
    function UserWithAnnotatedPosts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Type_1.Type(Post),
        __metadata("design:type", Array)
    ], UserWithAnnotatedPosts.prototype, "posts", void 0);
    return UserWithAnnotatedPosts;
}(User));
var UserWithAliasedPrimitive = (function (_super) {
    __extends(UserWithAliasedPrimitive, _super);
    function UserWithAliasedPrimitive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Type_1.Type(String, 'second_name'),
        __metadata("design:type", String)
    ], UserWithAliasedPrimitive.prototype, "middleName", void 0);
    return UserWithAliasedPrimitive;
}(User));
var UserWithAnnotatedObject = (function (_super) {
    __extends(UserWithAnnotatedObject, _super);
    function UserWithAnnotatedObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Type_1.Type(Object),
        __metadata("design:type", Object)
    ], UserWithAnnotatedObject.prototype, "address", void 0);
    return UserWithAnnotatedObject;
}(User));
describe('Entity', function () {
    it('can decode a json payload into an entity', function () {
        var user = new User;
        user.fromJson({
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday']
        });
        expect(user.name).toEqual('Decahedron Technologies Ltd.');
        expect(user.email).toEqual('hello@decahedron.io');
        expect(user.daysAvailable).toEqual(['Monday', 'Wednesday', 'Friday']);
    });
    it('does not decode a nested object', function () {
        var user = new UserWithAddress;
        user.fromJson({
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: {
                street: '20-22 Wenlock Road',
                city: 'London',
                zip: 'N1 7GU',
                country: 'United Kingdom'
            }
        });
        expect(user.address).toBeNull();
    });
    it('decodes an annotated nested object', function () {
        var user = new UserWithAnnotatedAddress();
        user.fromJson({
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: {
                street: '20-22 Wenlock Road',
                city: 'London',
                zip: 'N1 7GU',
                country: 'United Kingdom'
            }
        });
        expect(user.address).toBeDefined();
        expect(user.address.street).toEqual('20-22 Wenlock Road');
        expect(user.address.city).toEqual('London');
        expect(user.address.zip).toEqual('N1 7GU');
        expect(user.address.country).toEqual('United Kingdom');
    });
    it('decodes an annotated optional nested array object', function () {
        var user = new UserWithAnnotatedPosts();
        user.fromJson({
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            posts: [{
                    title: 'About',
                    content: 'Lorem ipsum dolor sit amet'
                }]
        });
        expect(user.posts).toBeDefined();
        expect(user.posts[0]).toBeDefined();
        expect(user.posts[0].title).toEqual('About');
        expect(user.posts[0].content).toEqual('Lorem ipsum dolor sit amet');
    });
    it('decodes an annotated optional nested array object to empty array', function () {
        var user = new UserWithAnnotatedPosts();
        user.fromJson({
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            posts: []
        });
        expect(user.posts).toBeDefined();
        expect(user.posts).toEqual([]);
    });
    it('interprets an annotated primitive as an alias', function () {
        var user = new UserWithAliasedPrimitive();
        user.fromJson({
            name: 'Decahedron Technologies Ltd',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            second_name: 'A Middle Name'
        });
        expect(user.middleName).toEqual('A Middle Name');
    });
    it('can decode an annotated Object, without being an entity', function () {
        var user = new UserWithAnnotatedObject();
        user.fromJson({
            name: 'Decahedron Technologies Ltd',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: {
                street: '20-22 Wenlock Road',
                city: 'London',
                zip: 'N1 7GU',
                country: 'United Kingdom'
            }
        });
        expect(user.address).toBeDefined();
        expect(user.address['street']).toEqual('20-22 Wenlock Road');
        expect(user.address['city']).toEqual('London');
        expect(user.address['zip']).toEqual('N1 7GU');
        expect(user.address['country']).toEqual('United Kingdom');
    });
});
//# sourceMappingURL=Entity.spec.js.map