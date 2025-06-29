import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
        </div>
    )
}
