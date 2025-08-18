"use strict";
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
exports.EditLightningDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EditLightningDto {
    id;
    user_id;
    date;
    name;
    file_base64;
}
exports.EditLightningDto = EditLightningDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditLightningDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditLightningDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-05-08', description: 'Tanggal petir' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], EditLightningDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Petir Barat', description: 'Nama petir' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditLightningDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'data:image/jpeg;base64,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MlFntTD/AJQkyaj12ccONS3tLX3/AIB6fZW1WYbcur7N80Jij3dYN7Csa9c4q3B2rfmkqUq6v+EfDAVh/wBe1fLBRWC9GdD5aFg1NXjgV8uxSYjOY1+0lXZuArEW7iaBgA4Oz5WKGXr5KMUD5U3DnJGXh4E3x8VHv1tyEARptXy0oYOjk4PYYvAqIh+lbKRrjR1Kl5fmMilfLXWhATwDLiIar+CkRgQmj3rZ2YH7woAABaDMgEo1VbWbPcQOU+KhLBAZvFD2fnthLBdo+VHnOE4SiEp9ZXXHat9Jz9dM8Lg/qpIYezh27fFs9NupFCB2ezGOL5vn4Lz7P6jbP/JPsdmUcDxn5pzOn//aAAwDAQACAAMAAAAQ88888888888888888888888888888888888888888880888888888888888888jc88888888888888888488888zRcoUy88888888628883s/wD/APdnfzzzzzzzzzzzq3jD+9557zzzzzzzzzzxl/xTD/jbz7zzzzzzzzzxj6+6Y+a65/zzzzzzzzzw3/8A/wD/AP8A/wDnvPPPPPPPPPKFf/2t/wD/AEW88888888888p8/vf/AIZ/PPPPPPPPPPPPH0tce/vPPPPPPPPPPPPPOs+8evvPPPPPPPPPPLvtnH//AO52/fzzzzzzzyK7/wD/AP8A/wD/AP8A+7vbzzzzz6Xf/wD/AP8A/wD/AP8A/wD/AL/PPPPB/wD/AP8A/wD/AP8A/wD/AP8A/wC9vzzzzT//AP8A/wD/AP8A/wD/AP8A/wD9/wA8888//wD/AP8A/wD/AP8A/wD/AP8A/wCvPP/EAB8RAAICAgMBAQEAAAAAAAAAAAERADAQMSBAQSFRYP/aAAgBAwEBPxD+XTxWJ0ADgC4lrgPkccEMeA9sG4sOPDjhDs24DBgwd1jdBKtL5l8D8tBUB4kqH7c1BKYHolEYjFcATAHsAHAxIfzCFTuCBSQ4U1QCgNnpyH27cIXEEOpGul//xAAdEQEAAgIDAQEAAAAAAAAAAAABABEgMBAxQFAh/9oACAECAQE/EPvX5DFYxcvgN6gwWpeI1B2v7mOx4OKwPKOvINjmF7UjiEDdXCpUqV4Lly5e5ZcvG4MvSsXWObF2jku8xfhu3P8A/8QALBABAAEDAgQGAgIDAQAAAAAAAREAITFBYUBRcYEQIDCRobHB0VDwYOHxcP/aAAgBAQABPxD/ANOmej+HkaP4ZMgIUGYcH8PMsqxvn03CWQBV6VGJL0Pxz8UNfuST7qUQQvoCkjyxAn3RqK0Q3vb5qBWmIT7i3DTdzff0gSkYAJV2KLWVxjuT+3SgsKQol9Vf+6UWqevg096NkhCgR6mKJeS453fD2in8ZWue9o7WrXglCaEx19FFC6ktPOZKr7AxO/tFB6CSUDvb3j/TR8OZdV77aD73ieBSSGgw9Am1AAJVcBvQUwXt4cj9ta+hrtjxD2dAkRyJRgFPMnzdsfN88SRMmO41OzH/ACjPitHumVgDdqdzSJB5eISVAXVwUAFCNxHwwMUBT0mnbNTUoUxloNzNC7E5uZE2S/EEZIeRdiXYo+UCd93dZ+abFBSIgQLA3pkTE3m7FT9JgTEcsfuiBLdw9GLd5az1gyqnNfEHcwwGbPUpbMMwT+xTS9kJK7QBLgELc80Y6HBMwHgZEYzVXXZk7nD21xRDhJkmLR8UM7eAxTtsDaF+dqhFEE2/KLqBCAgBAbRip8J8J8FDU8hu2QbaH3ikRRIZjhsjQrBJlsCPlfFxUGDcgZbNihSWEn4dFMCFARLyGfxSv8J+nTbO9LCYcb+A9gjDMXjHVpKLXN1n3qz3ZgdKZasi2I7LBQEYSHg4tmjBQCOQ3D54ZxU+5l/bpTk8G5QYWVsCrmUz3pWUiwhp0YqHEOCCJtBsUuo9vFhMsZA96M+FtBSZHs0PPQX+KM1HgAEme2KGkjJTHCT0Bfajfw1aFMRK+B+OH6RRRqeRpTngUuQUEFT3LPzBfyYRNQ4RkWBMidKcWRISy1jkeOrUY5L4P54ZxUgth7IP2ta+u4qLmQR7P04ewcBuIvvC9q1PXjtnG8GO9M5LU5rdeHm+QqHc7hSjXHGwiWfbzPTg0QDIxqeiDvKi4vfLHzxDiiyBO6r8jPfbyuOdNQngl5k/Nr06sMWU2GT6oaHukLz2f2fMPdxmgZalvE2Hg/PvxGKZ6UDT9m1JgWcsv6nI1F/I0xcsgnfNankcUtCkzkIGg8j+4vrxUNfIZWROWKPEBKo6PM3+vLNT4tqBEACVmIOdEWTGzSOTZpOeNWvErhoMw7A3dQ+lulX4VBke/jFW8J3ppEjJdfbTvUYL1mv1Nelq05cfNbuSJdTD7VH6lLJu5PYoqFucR7jPxRa7H+CNEdka/vFBRoBAHa/3QTgiGXWV/kpKxpUlXmv+D5YKfhHlI0Tb9v3SgPYx+pq+dBVfqv8Akv6oxeu8PxXxcQ+yn7c8R8DU9BnNKQhjiwWwK0uOSwTdJu9qWEu2Du/oqFQ3Nfm1GTbAQe1X8zUToVNSTqA+5en0xsQBdln5oMH0t9n6mm5nkddx4YFQJltagIxTbLNv2omBN71BsdjwnZqevoOKPJu0RITo5oEwGZknRw96yFcCHr/s4NrOsWvVeexQG4gx0YPlrr14JxTPpQJzHSimCusW9zU3OA6UYVjCymQ5G/TejKXAP7ffw14Jx4OMTQvxERbV0O39WaFQhCbeshKE5Ctf2exrRKUgEAGAOW3ENyg9lclgH5+/agpFBhHI+o1ZIx6aA3aNkMCwBaPAmeHceBmTbD9OrE/99NCFRgDnSrDuBadCxxhykkYRIabN3ecTbuYfSUBZTcv0bMvajGpxbinFSJykYvLPzFM2Q9EJdzTsofI8cZQR7vakaIVH0RNIlvUS+V45xRlkEhsNz79GIBix7OOa0GJPRoB0X1EP1x+qv0Lfjy//2Q==',
        description: 'File petir dalam base64',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditLightningDto.prototype, "file_base64", void 0);
//# sourceMappingURL=edit-lightning.dto.js.map