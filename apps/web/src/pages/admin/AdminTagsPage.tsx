import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Tag as TagIcon } from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { createTag, updateTag, deleteTag } from '@/services/tag.service';
import { Tag } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface TagFormData {
    name: string;
    category: string;
    color: string;
    description?: string;
}

const CATEGORIES = [
    { value: 'TOPIC', label: 'Topic', color: '#3B82F6' },
    { value: 'TYPE', label: 'Type', color: '#8B5CF6' },
    { value: 'DIFFICULTY', label: 'Difficulty', color: '#F59E0B' },
    { value: 'GOAL', label: 'Goal', color: '#EC4899' },
];

const DEFAULT_COLORS = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
];

export function AdminTagsPage() {
    const { tags, loading, refetch } = useTags();
    const [ searchQuery, setSearchQuery ] = useState( '' );
    const [ selectedCategory, setSelectedCategory ] = useState<string>( 'ALL' );
    const [ isCreateDialogOpen, setIsCreateDialogOpen ] = useState( false );
    const [ isEditDialogOpen, setIsEditDialogOpen ] = useState( false );
    const [ editingTag, setEditingTag ] = useState<any>( null );
    const [ formData, setFormData ] = useState<TagFormData>( {
        name: '',
        category: 'TOPIC',
        color: DEFAULT_COLORS[ 0 ],
        description: '',
    } );
    const [ submitting, setSubmitting ] = useState( false );

    const filteredTags = tags.filter( tag => {
        const matchesSearch = tag.name.toLowerCase().includes( searchQuery.toLowerCase() );
        const matchesCategory = selectedCategory === 'ALL' || tag.category === selectedCategory;
        return matchesSearch && matchesCategory;
    } );

    const handleCreate = async () => {
        try {
            setSubmitting( true );
            await createTag( formData );
            toast.success( 'Tag created successfully' );
            setIsCreateDialogOpen( false );
            resetForm();
            refetch();
        } catch ( err: any ) {
            toast.error( err.message || 'Failed to create tag' );
        } finally {
            setSubmitting( false );
        }
    };

    const handleEdit = async () => {
        if ( !editingTag ) return;
        try {
            setSubmitting( true );
            await updateTag( editingTag.id, formData );
            toast.success( 'Tag updated successfully' );
            setIsEditDialogOpen( false );
            setEditingTag( null );
            resetForm();
            refetch();
        } catch ( err: any ) {
            toast.error( err.message || 'Failed to update tag' );
        } finally {
            setSubmitting( false );
        }
    };

    const handleDelete = async ( tagId: string ) => {
        if ( !confirm( 'Are you sure you want to delete this tag?' ) ) return;
        try {
            await deleteTag( tagId );
            toast.success( 'Tag deleted successfully' );
            refetch();
        } catch ( err: any ) {
            toast.error( err.message || 'Failed to delete tag' );
        }
    };

    const openEditDialog = ( tag: any ) => {
        setEditingTag( tag );
        setFormData( {
            name: tag.name,
            category: tag.category || 'TOPIC',
            color: tag.color || DEFAULT_COLORS[ 0 ],
            description: tag.description || '',
        } );
        setIsEditDialogOpen( true );
    };

    const resetForm = () => {
        setFormData( {
            name: '',
            category: 'TOPIC',
            color: DEFAULT_COLORS[ 0 ],
            description: '',
        } );
    };

    const groupedTags = filteredTags.reduce( ( acc, tag ) => {
        const category = tag.category || 'Other';
        if ( !acc[ category ] ) acc[ category ] = [];
        acc[ category ].push( tag );
        return acc;
    }, {} as Record<string, typeof tags> );

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <TagIcon className="h-8 w-8" />
                        Manage Tags
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Create and manage tags for categorizing problems, modules, and topics
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen( true )}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Tag
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tags..."
                                value={searchQuery}
                                onChange={( e ) => setSearchQuery( e.target.value )}
                                className="pl-9"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Categories</SelectItem>
                                {CATEGORIES.map( ( cat ) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ) )}
                            </SelectContent>
                        </Select>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Loading tags...
                        </div>
                    ) : filteredTags.length === 0 ? (
                        <div className="text-center py-12">
                            <TagIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No tags found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchQuery || selectedCategory !== 'ALL'
                                    ? 'Try adjusting your filters'
                                    : 'Get started by creating your first tag'}
                            </p>
                            {!searchQuery && selectedCategory === 'ALL' && (
                                <Button onClick={() => setIsCreateDialogOpen( true )}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Your First Tag
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries( groupedTags ).map( ( [ category, categoryTags ] ) => (
                                <div key={category}>
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <div 
                                            className="w-3 h-3 rounded-full"
                                            style={{ 
                                                backgroundColor: CATEGORIES.find( c => c.value === category )?.color || '#64748b'
                                            }}
                                        />
                                        {category}
                                        <span className="text-sm text-muted-foreground font-normal">
                                            ({categoryTags.length})
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {categoryTags.map( ( tag ) => (
                                            <Card key={tag.id} className="group hover:shadow-md transition-shadow">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <Tag
                                                                name={tag.name}
                                                                color={tag.color}
                                                                className="mb-2"
                                                            />
                                                            {tag.description && (
                                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                                    {tag.description}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-muted-foreground mt-2">
                                                                Used {tag.usageCount} {tag.usageCount === 1 ? 'time' : 'times'}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => openEditDialog( tag )}
                                                            >
                                                                <Pencil className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                                onClick={() => handleDelete( tag.id )}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ) )}
                                    </div>
                                </div>
                            ) )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Tag</DialogTitle>
                        <DialogDescription>
                            Add a new tag to categorize your content
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tag Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Python, Arrays, Beginner"
                                value={formData.name}
                                onChange={( e ) => setFormData( { ...formData, name: e.target.value } )}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={( value ) =>
                                    setFormData( { ...formData, category: value } )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map( ( cat ) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: cat.color }}
                                                />
                                                {cat.label}
                                            </div>
                                        </SelectItem>
                                    ) )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex gap-2 flex-wrap">
                                {DEFAULT_COLORS.map( ( color ) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${ 
                                            formData.color === color
                                                ? 'border-foreground scale-110 shadow-md'
                                                : 'border-border'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData( { ...formData, color } )}
                                        title={color}
                                    />
                                ) )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="Brief description of the tag..."
                                value={formData.description}
                                onChange={( e ) =>
                                    setFormData( { ...formData, description: e.target.value } )
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateDialogOpen( false );
                                resetForm();
                            }}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={submitting || !formData.name.trim()}>
                            {submitting ? 'Creating...' : 'Create Tag'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Tag</DialogTitle>
                        <DialogDescription>Update tag details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Tag Name *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={( e ) => setFormData( { ...formData, name: e.target.value } )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={( value ) =>
                                    setFormData( { ...formData, category: value } )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map( ( cat ) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: cat.color }}
                                                />
                                                {cat.label}
                                            </div>
                                        </SelectItem>
                                    ) )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex gap-2 flex-wrap">
                                {DEFAULT_COLORS.map( ( color ) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                                            formData.color === color
                                                ? 'border-foreground scale-110 shadow-md'
                                                : 'border-border'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData( { ...formData, color } )}
                                        title={color}
                                    />
                                ) )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description (Optional)</Label>
                            <Input
                                id="edit-description"
                                value={formData.description}
                                onChange={( e ) =>
                                    setFormData( { ...formData, description: e.target.value } )
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditDialogOpen( false );
                                setEditingTag( null );
                                resetForm();
                            }}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} disabled={submitting || !formData.name.trim()}>
                            {submitting ? 'Updating...' : 'Update Tag'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
