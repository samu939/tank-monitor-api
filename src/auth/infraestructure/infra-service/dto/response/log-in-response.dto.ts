
export interface LogInResponseDto {
    token: string,
    user: {
        id: string,
        email: string,
        name: string,
        phone?: string,
    }        
}