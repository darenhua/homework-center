import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCourse, createCourseSchema, type CreateCourseFormValues } from "@/hooks/mutations";

interface CreateCourseDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateCourseDialog({ isOpen, onOpenChange }: CreateCourseDialogProps) {
    const form = useForm<CreateCourseFormValues>({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            title: "",
        },
    });

    const createCourseMutation = useCreateCourse();

    const onSubmit = (values: CreateCourseFormValues) => {
        createCourseMutation.mutate(values, {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="mb-4">New Course</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>
                        Add a new course to the system.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter course title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={createCourseMutation.isPending}
                            >
                                {createCourseMutation.isPending
                                    ? "Creating..."
                                    : "Create Course"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
