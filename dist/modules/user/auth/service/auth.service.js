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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../database/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const common_2 = require("@nestjs/common");
const LoginResponseDTO_1 = require("../../dtos/LoginResponseDTO");
const EditAuthDetailsDTO_1 = require("../../dtos/EditAuthDetailsDTO");
const UserResponseDTO_1 = require("../../dtos/UserResponseDTO");
const otp_service_1 = require("../../../otp/service/otp.service");
const verifyOtp_1 = require("../../../otp/dtos/verifyOtp");
const createOtpDTO_1 = require("../../../otp/dtos/createOtpDTO");
const mailer_service_1 = require("../../../mail/service/mailer.service");
const googleapis_1 = require("googleapis");
const config_1 = require("@nestjs/config");
const class_transformer_1 = require("class-transformer");
const cloudinary_service_1 = require("../../../../config/cloudinary.service");
let AuthService = class AuthService {
    constructor(prismaService, otpService, mailService, configService, cloudinaryService) {
        this.prismaService = prismaService;
        this.otpService = otpService;
        this.mailService = mailService;
        this.configService = configService;
        this.cloudinaryService = cloudinaryService;
        this.oAuthClient = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    }
    async signup(dto) {
        const exists = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if (exists) {
            throw new common_2.ConflictException('Credentials in use');
        }
        const hashedPassword = await this.hashPassword(dto.password);
        const otpDTO = new createOtpDTO_1.CreateOtpDTO;
        otpDTO.email = dto.email;
        otpDTO.otpType = client_1.OtpType.REGISTER;
        const user = await this.prismaService.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hashedPassword,
                isBlocked: false,
                cart: {
                    create: {
                        quantity: 0,
                        cartTotal: 0
                    }
                },
                wishlist: {
                    create: {}
                },
                role: client_1.RoleType.USER,
                isVerified: false,
            }
        });
        const otp = await this.otpService.createOtp(otpDTO);
        try {
            await this.mailService.sendOtpMail(dto.email, otp, "Verify your email", 'otp');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
        return "Otp has been sent to your email, Please verify your account";
    }
    async uploadProfile(file, id) {
        const result = await this.cloudinaryService.uploadFile(file);
        const profile = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        if (!profile) {
            throw new common_1.NotFoundException("User does not exist");
        }
        const profileImage = await this.prismaService.user.update({
            where: {
                id
            },
            data: {
                image: result.url
            },
            select: {
                image: true
            }
        });
        return (0, class_transformer_1.plainToInstance)(UserResponseDTO_1.UserResponseDTO, profileImage);
    }
    async verifyEmail(token, email) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        if (user.isVerified) {
            return "User already verified";
        }
        const verifyOtpDTO = new verifyOtp_1.VerifyOtpDTO();
        verifyOtpDTO.email = user.email;
        verifyOtpDTO.otpType = client_1.OtpType.REGISTER;
        verifyOtpDTO.token = token;
        const verified = await this.otpService.verifyOtp(verifyOtpDTO);
        if (verified) {
            await this.prismaService.user.update({
                where: {
                    email
                },
                data: {
                    isVerified: true
                }
            });
            return "User Successfully Verified";
        }
        return "Incorrect Token";
    }
    async editUserDetails(dto, id) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            throw new common_2.UnauthorizedException('You do not have ccess to this account');
        }
        const updatedUser = await this.prismaService.user.update({
            where: {
                id
            },
            data: Object.assign({}, dto)
        });
        return (0, class_transformer_1.plainToInstance)(UserResponseDTO_1.UserResponseDTO, updatedUser);
    }
    async login(dto) {
        const exists = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { email: dto.usernameOrEmail },
                    { username: dto.usernameOrEmail }
                ]
            }
        });
        if (!exists) {
            throw new common_2.UnauthorizedException('The provided username or password is incorrect');
        }
        if (!exists.isVerified) {
            throw new common_2.UnauthorizedException('Please verify your account');
        }
        if (exists.isBlocked) {
            throw new common_2.UnauthorizedException('Account is blocked, Please contact support');
        }
        const passwordMatch = await this.passwordsMatch(exists.password, dto.password);
        if (!passwordMatch) {
            throw new common_2.UnauthorizedException("The password is incorrect");
        }
        const token = this.signJwt(exists.id);
        const role = exists.role;
        return (0, class_transformer_1.plainToInstance)(LoginResponseDTO_1.LoginResponseDTO, { token, role });
    }
    async getLoggedInUser(id) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            },
            include: {
                address: true
            }
        });
        return (0, class_transformer_1.plainToInstance)(UserResponseDTO_1.UserResponseDTO, user);
    }
    async deleteMyAccount(id) {
        await this.prismaService.user.update({
            where: {
                id
            },
            data: {
                isVerified: false
            }
        });
        return "Account Deactivated Successfully";
    }
    async editUsernameOrEmail(id, dto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const updatedUser = await this.prismaService.user.update({
            where: {
                id
            },
            data: Object.assign({}, dto)
        });
        return (0, class_transformer_1.plainToInstance)(EditAuthDetailsDTO_1.EditAuthDetailsDTO, updatedUser);
    }
    async updatePassword(id, dto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const passwordMatch = await this.passwordsMatch(user.password, dto.oldPassword);
        if (!passwordMatch) {
            throw new common_1.BadRequestException("Incorrect Password");
        }
        if (dto.newPassword !== dto.confirmPassword) {
            throw new common_1.BadRequestException("new password and confirm password does not match");
        }
        const hashedPassword = await this.hashPassword(dto.confirmPassword);
        await this.prismaService.user.update({
            where: {
                id
            },
            data: {
                password: hashedPassword
            }
        });
        return "Password Updated Successfully";
    }
    async verifyResetOtp(token, email) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const verifyOtpDTO = new verifyOtp_1.VerifyOtpDTO();
        verifyOtpDTO.email = user.email;
        verifyOtpDTO.otpType = client_1.OtpType.RESET;
        verifyOtpDTO.token = token;
        const verified = await this.otpService.verifyOtp(verifyOtpDTO);
        if (verified) {
            return "Verification Successfull";
        }
        return "Incorrect Token";
    }
    async resendEmailOtp(email) {
        const otpDTO = new createOtpDTO_1.CreateOtpDTO;
        otpDTO.email = email;
        otpDTO.otpType = client_1.OtpType.REGISTER;
        const otp = await this.otpService.createOtp(otpDTO);
        try {
            await this.mailService.sendOtpMail(email, otp, "Verify your email", 'otp');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
        return "Otp sent successfully";
    }
    async sendResetOtp(email) {
        const otpDTO = new createOtpDTO_1.CreateOtpDTO;
        otpDTO.email = email;
        otpDTO.otpType = client_1.OtpType.RESET;
        const otp = await this.otpService.createOtp(otpDTO);
        try {
            await this.mailService.sendOtpMail(email, otp, "Verify your email", 'reset');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
        return "Otp sent successfully";
    }
    async resetPassword(email, dto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        if (dto.newPassword !== dto.confirmPassword) {
            throw new common_1.BadRequestException("new password and confirm password does not match");
        }
        const hashedPassword = await this.hashPassword(dto.newPassword);
        await this.prismaService.user.update({
            where: {
                email
            },
            data: {
                password: hashedPassword
            }
        });
        return "Password Reset Successfull";
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    async passwordsMatch(passwordFromDb, loginPassword) {
        return await bcrypt.compare(loginPassword, passwordFromDb);
    }
    signJwt(id) {
        return jwt.sign({
            id
        }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
    }
    verifyJwt(token) {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, otp_service_1.OtpService, mailer_service_1.MailService, config_1.ConfigService, cloudinary_service_1.CloudinaryService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map